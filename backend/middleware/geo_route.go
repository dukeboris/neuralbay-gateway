package middleware

import (
	"github.com/QuantumNous/new-api/common"
	"github.com/gin-gonic/gin"
)

// GeoRoute adds geo-routing metadata to the request context.
// Sets "client_region" and "node_region" in the Gin context for
// downstream handlers to use for regional routing decisions.
func GeoRoute() gin.HandlerFunc {
	resolver := common.GetGeoResolver()

	return func(c *gin.Context) {
		clientIP := c.ClientIP()
		clientRegion := resolver.ResolveRegion(clientIP)
		nodeRegion := resolver.GetNodeRegion()

		c.Set("client_region", string(clientRegion))
		c.Set("node_region", string(nodeRegion))
		c.Set("geo_routed", clientRegion != nodeRegion)

		// Add response header for debugging
		c.Header("X-Region-Client", string(clientRegion))
		c.Header("X-Region-Node", string(nodeRegion))

		c.Next()
	}
}
