package controller

import (
	"encoding/json"
	"fmt"
	"io"
	"time"

	"github.com/QuantumNous/new-api/model"

	"github.com/gin-gonic/gin"
)

// DashboardStats represents real-time dashboard statistics
type DashboardStats struct {
	TotalRequests int64  `json:"total_requests"`
	TokensUsed    int64  `json:"tokens_used"`
	ActiveKeys    int64  `json:"active_keys"`
	Timestamp     int64  `json:"timestamp"`
	Status        string `json:"status"`
}

// DashboardSSE streams real-time dashboard stats via Server-Sent Events
func DashboardSSE(c *gin.Context) {
	userId := c.GetInt("id")

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("X-Accel-Buffering", "no")

	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	clientGone := c.Request.Context().Done()

	// Send initial stats
	sendStats(c, userId)

	for {
		select {
		case <-ticker.C:
			sendStats(c, userId)
		case <-clientGone:
			return
		}
	}
}

func sendStats(c *gin.Context, userId int) {
	stats := DashboardStats{
		Timestamp: time.Now().Unix(),
		Status:    "ok",
	}

	// Get user info
	user, err := model.GetUserById(userId, false)
	if err == nil && user != nil {
		stats.TokensUsed = int64(user.UsedQuota)
		stats.TotalRequests = int64(user.RequestCount)
	}

	// Count active keys
	count, err := model.CountUserTokens(userId)
	if err == nil {
		stats.ActiveKeys = count
	}

	data, err := json.Marshal(stats)
	if err != nil {
		return
	}

	event := fmt.Sprintf("data: %s\n\n", string(data))
	io.WriteString(c.Writer, event)
	c.Writer.Flush()
}
