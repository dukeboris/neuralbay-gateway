package middleware

import (
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	httpRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "neuralbay_http_requests_total",
			Help: "Total number of HTTP requests",
		},
		[]string{"method", "path", "status"},
	)

	httpRequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "neuralbay_http_request_duration_seconds",
			Help:    "HTTP request latency in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"method", "path"},
	)

	relayRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "neuralbay_relay_requests_total",
			Help: "Total number of relay requests by model",
		},
		[]string{"model", "channel_type", "status"},
	)

	relayTokensTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "neuralbay_relay_tokens_total",
			Help: "Total tokens processed by model",
		},
		[]string{"model", "type"},
	)

	activeChannels = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "neuralbay_active_channels",
			Help: "Number of active upstream channels",
		},
	)

	activeUsers = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "neuralbay_active_users",
			Help: "Number of active users",
		},
	)

	dbConnections = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "neuralbay_db_connections",
			Help: "Number of database connections",
		},
	)
)

// PrometheusMetrics returns a Gin middleware that records HTTP metrics
func PrometheusMetrics() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.FullPath()
		if path == "" {
			path = c.Request.URL.Path
		}

		c.Next()

		duration := time.Since(start).Seconds()
		status := strconv.Itoa(c.Writer.Status())

		httpRequestsTotal.WithLabelValues(c.Request.Method, path, status).Inc()
		httpRequestDuration.WithLabelValues(c.Request.Method, path).Observe(duration)
	}
}

// RecordRelayRequest records a relay request metric
func RecordRelayRequest(model, channelType, status string) {
	relayRequestsTotal.WithLabelValues(model, channelType, status).Inc()
}

// RecordRelayTokens records token usage for a model
func RecordRelayTokens(model, tokenType string, count float64) {
	relayTokensTotal.WithLabelValues(model, tokenType).Add(count)
}

// SetActiveChannels sets the active channels gauge
func SetActiveChannels(count float64) {
	activeChannels.Set(count)
}

// SetActiveUsers sets the active users gauge
func SetActiveUsers(count float64) {
	activeUsers.Set(count)
}

// SetDBConnections sets the DB connection gauge
func SetDBConnections(count float64) {
	dbConnections.Set(count)
}
