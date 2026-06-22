package common

import (
	"net"
	"os"
	"strings"
	"sync"
)

// Region represents a geographic deployment region
type Region string

const (
	RegionBahrain   Region = "bahrain"
	RegionSingapore Region = "singapore"
	RegionFrankfurt Region = "frankfurt"
	RegionDefault   Region = "default"
)

// GeoResolver maps client IP addresses to the nearest deployment region.
// In production this should use a GeoIP database (MaxMind or IP2Location).
// For the initial implementation, we use a CIDR-based approach with
// well-known cloud provider IP ranges for GCC and SEA regions.
type GeoResolver struct {
	mu       sync.RWMutex
	cidrs    map[Region][]*net.IPNet
	nodeName Region // current node's region
}

var globalResolver *GeoResolver
var resolverOnce sync.Once

func GetGeoResolver() *GeoResolver {
	resolverOnce.Do(func() {
		globalResolver = newGeoResolver()
	})
	return globalResolver
}

func newGeoResolver() *GeoResolver {
	r := &GeoResolver{
		cidrs:    make(map[Region][]*net.IPNet),
		nodeName: RegionDefault,
	}

	// Override node region from env
	if env := os.Getenv("NODE_REGION"); env != "" {
		r.nodeName = Region(strings.ToLower(strings.TrimSpace(env)))
	}

	// Pre-seed with common GCC cloud provider IP ranges
	r.addCIDRs(RegionBahrain, []string{
		// AWS me-south-1 (Bahrain)
		"157.175.0.0/16",
		"15.184.0.0/16",
		"15.185.0.0/16",
		// AWS me-central-1 (UAE)
		"16.23.0.0/16",
		"16.24.0.0/16",
	})

	// Pre-seed with common SEA cloud provider IP ranges
	r.addCIDRs(RegionSingapore, []string{
		// GCP asia-southeast1 (Singapore)
		"34.87.0.0/16",
		"34.126.0.0/16",
		"35.185.0.0/16",
		"35.197.0.0/16",
		// AWS ap-southeast-1 (Singapore)
		"13.212.0.0/16",
		"18.136.0.0/16",
		"18.138.0.0/16",
		"54.251.0.0/16",
	})

	return r
}

func (r *GeoResolver) addCIDRs(region Region, cidrs []string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	for _, cidr := range cidrs {
		_, ipnet, err := net.ParseCIDR(cidr)
		if err != nil {
			continue
		}
		r.cidrs[region] = append(r.cidrs[region], ipnet)
	}
}

// ResolveRegion determines which region a client IP belongs to.
// Returns the nearest region name.
func (r *GeoResolver) ResolveRegion(clientIP string) Region {
	r.mu.RLock()
	defer r.mu.RUnlock()

	ip := net.ParseIP(clientIP)
	if ip == nil {
		return RegionDefault
	}

	// Check each region's CIDR ranges
	for region, cidrs := range r.cidrs {
		for _, cidr := range cidrs {
			if cidr.Contains(ip) {
				return region
			}
		}
	}

	// Fallback: heuristic based on IP geography (simplified)
	// In production, use MaxMind GeoIP2 database
	return RegionDefault
}

// GetNodeRegion returns the current server node's region
func (r *GeoResolver) GetNodeRegion() Region {
	return Region(r.nodeName)
}

// ResolveUpstreamBaseURL returns the best upstream URL for a client based on geo-routing.
// If the client is in GCC, prefer Bahrain upstream; if in SEA, prefer Singapore.
// This is used when the gateway itself acts as a relay to a regional API endpoint.
func (r *GeoResolver) ResolveUpstreamBaseURL(clientIP string, defaultURL string, regionalURLs map[Region]string) string {
	region := r.ResolveRegion(clientIP)

	// If client is in a region we have a local upstream for, use it
	if url, ok := regionalURLs[region]; ok && url != "" {
		return url
	}

	// If the current node matches the client region, use default
	if Region(r.nodeName) == region {
		return defaultURL
	}

	// Fall back to default
	return defaultURL
}

