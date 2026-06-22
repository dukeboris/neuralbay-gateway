package service

import (
	"fmt"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/QuantumNous/new-api/dto"
	"github.com/QuantumNous/new-api/types"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/require"
)

func buildChannelAffinityStatsContextForTest(ruleName, usingGroup, keyFP string) *gin.Context {
	rec := httptest.NewRecorder()
	ctx, _ := gin.CreateTestContext(rec)
	setChannelAffinityContext(ctx, channelAffinityMeta{
		CacheKey:       fmt.Sprintf("test:%s:%s:%s", ruleName, usingGroup, keyFP),
		TTLSeconds:     600,
		RuleName:       ruleName,
		UsingGroup:     usingGroup,
		KeyFingerprint: keyFP,
	})
	return ctx
}

func TestObserveChannelAffinityUsageCacheByRelayFormat_ClaudeMode(t *testing.T) {
	ruleName := fmt.Sprintf("rule_%d", time.Now().UnixNano())
	usingGroup := "default"
	keyFP := fmt.Sprintf("fp_%d", time.Now().UnixNano())
	ctx := buildChannelAffinityStatsContextForTest(ruleName, usingGroup, keyFP)

	usage := &dto.Usage{
		PromptTokens:     100,
		CompletionTokens: 40,
		TotalTokens:      140,
		PromptTokensDetails: dto.InputTokenDetails{
			CachedTokens: 30,
		},
	}

	ObserveChannelAffinityUsageCacheByRelayFormat(ctx, usage, types.RelayFormatClaude)
	stats := GetChannelAffinityUsageCacheStats(ruleName, usingGroup, keyFP)

	require.GreaterOrEqual(t, stats.Total, int64(1))
	require.GreaterOrEqual(t, stats.Hit, int64(1))
	require.GreaterOrEqual(t, stats.PromptTokens, int64(100))
	require.GreaterOrEqual(t, stats.CompletionTokens, int64(40))
	require.GreaterOrEqual(t, stats.TotalTokens, int64(140))
	require.GreaterOrEqual(t, stats.CachedTokens, int64(30))
	require.Equal(t, cacheTokenRateModeCachedOverPromptPlusCached, stats.CachedTokenRateMode)
}

func TestObserveChannelAffinityUsageCacheByRelayFormat_MixedMode(t *testing.T) {
	ruleName := fmt.Sprintf("rule_%d", time.Now().UnixNano())
	usingGroup := "default"
	keyFP := fmt.Sprintf("fp_%d", time.Now().UnixNano())
	ctx := buildChannelAffinityStatsContextForTest(ruleName, usingGroup, keyFP)

	openAIUsage := &dto.Usage{
		PromptTokens: 100,
		PromptTokensDetails: dto.InputTokenDetails{
			CachedTokens: 10,
		},
	}
	claudeUsage := &dto.Usage{
		PromptTokens: 80,
		PromptTokensDetails: dto.InputTokenDetails{
			CachedTokens: 20,
		},
	}

	ObserveChannelAffinityUsageCacheByRelayFormat(ctx, openAIUsage, types.RelayFormatOpenAI)
	ObserveChannelAffinityUsageCacheByRelayFormat(ctx, claudeUsage, types.RelayFormatClaude)
	stats := GetChannelAffinityUsageCacheStats(ruleName, usingGroup, keyFP)

	require.GreaterOrEqual(t, stats.Total, int64(2))
	require.GreaterOrEqual(t, stats.Hit, int64(2))
	require.GreaterOrEqual(t, stats.PromptTokens, int64(180))
	require.GreaterOrEqual(t, stats.CachedTokens, int64(30))
	require.Equal(t, cacheTokenRateModeMixed, stats.CachedTokenRateMode)
}

func TestObserveChannelAffinityUsageCacheByRelayFormat_UnsupportedModeKeepsEmpty(t *testing.T) {
	ruleName := fmt.Sprintf("rule_%d", time.Now().UnixNano())
	usingGroup := "default"
	keyFP := fmt.Sprintf("fp_%d", time.Now().UnixNano())
	ctx := buildChannelAffinityStatsContextForTest(ruleName, usingGroup, keyFP)

	usage := &dto.Usage{
		PromptTokens: 100,
		PromptTokensDetails: dto.InputTokenDetails{
			CachedTokens: 25,
		},
	}

	ObserveChannelAffinityUsageCacheByRelayFormat(ctx, usage, types.RelayFormatGemini)
	stats := GetChannelAffinityUsageCacheStats(ruleName, usingGroup, keyFP)

	require.GreaterOrEqual(t, stats.Total, int64(1))
	require.GreaterOrEqual(t, stats.Hit, int64(1))
	require.GreaterOrEqual(t, stats.CachedTokens, int64(25))
}
