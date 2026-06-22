package controller

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/QuantumNous/new-api/common"

	"github.com/gin-gonic/gin"
)

// ——— MADA (沙特) — 通过 Checkout.com / HyperPay 统一支付网关 ———

// MadaPaymentRequest represents a MADA payment via HyperPay/Checkout.com
type MadaPaymentRequest struct {
	Amount   float64 `json:"amount"`   // in SAR
	UserID   int     `json:"user_id"`
	TopUpID  int     `json:"topup_id"`
	Currency string  `json:"currency"` // default: SAR
}

// MadaPaymentResponse contains the redirect URL for the MADA payment page
type MadaPaymentResponse struct {
	PaymentID   string `json:"payment_id"`
	RedirectURL string `json:"redirect_url"`
	Amount      string `json:"amount"`
	Currency    string `json:"currency"`
	Status      string `json:"status"`
}

// CreateMadaPayment initiates a MADA payment and returns a redirect URL.
// MADA is the Saudi Arabian domestic debit card network.
// Integration: Checkout.com / HyperPay unified payment gateway.
func CreateMadaPayment(c *gin.Context) {
	var req MadaPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiError(c, fmt.Errorf("invalid request: %w", err))
		return
	}

	if req.Amount <= 0 {
		common.ApiError(c, fmt.Errorf("amount must be positive"))
		return
	}

	userID := c.GetInt("id")
	if req.UserID == 0 {
		req.UserID = userID
	}
	if req.Currency == "" {
		req.Currency = "SAR"
	}

	hyperPayKey := os.Getenv("HYPERPAY_SECRET_KEY")
	hyperPayBase := os.Getenv("HYPERPAY_BASE_URL")
	if hyperPayBase == "" {
		hyperPayBase = "https://eu-test.oppwa.com" // Checkout.com test endpoint
	}

	// Build checkout payload
	payload := map[string]interface{}{
		"entityId":       os.Getenv("HYPERPAY_ENTITY_ID"),
		"amount":         fmt.Sprintf("%.2f", req.Amount),
		"currency":       req.Currency,
		"paymentType":    "DB", // Debit
		"merchantTransactionId": fmt.Sprintf("neuralbay-mada-%d-%d", req.UserID, time.Now().Unix()),
		"customer.email":        c.GetString("email"),
		"billing.country":       "SA",
		"customParameters[topup_id]": strconv.Itoa(req.TopUpID),
	}

	// ⚠️ 生产环境：实际调用 HyperPay API
	// resp, err := callHyperPay(hyperPayBase, hyperPayKey, payload)
	// For now: return stub
	_ = hyperPayKey
	_ = payload

	paymentID := fmt.Sprintf("mada_%d_%d", req.UserID, time.Now().UnixMilli())

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": MadaPaymentResponse{
			PaymentID:   paymentID,
			RedirectURL: fmt.Sprintf("%s/v1/checkouts/%s/payment", hyperPayBase, paymentID),
			Amount:      fmt.Sprintf("%.2f", req.Amount),
			Currency:    req.Currency,
			Status:      "pending_redirect",
		},
	})
}

// MadaWebhook handles POST callbacks from HyperPay/Checkout.com
func MadaWebhook(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cannot read body"})
		return
	}

	// Verify webhook signature
	signatureKey := os.Getenv("HYPERPAY_WEBHOOK_SECRET")
	receivedSig := c.GetHeader("X-Webhook-Signature")
	if signatureKey != "" && receivedSig != "" {
		mac := hmac.New(sha256.New, []byte(signatureKey))
		mac.Write(body)
		expectedSig := hex.EncodeToString(mac.Sum(nil))
		if !hmac.Equal([]byte(receivedSig), []byte(expectedSig)) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid signature"})
			return
		}
	}

	var webhook map[string]interface{}
	if err := json.Unmarshal(body, &webhook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	result := webhook["result"]
	resultCode, _ := result.(map[string]interface{})["code"].(string)

	if resultCode == "000.000.000" || resultCode == "000.100.110" {
		// Payment successful — grant quota
		topUpID, _ := strconv.Atoi(fmt.Sprintf("%v", webhook["customParameters"].(map[string]interface{})["topup_id"]))
		amount, _ := strconv.ParseFloat(fmt.Sprintf("%v", webhook["amount"]), 64)

		common.SysLog(fmt.Sprintf("MADA payment success: topup=%d amount=%.2f", topUpID, amount))
		// model.GrantQuota(topUpID, amount) — actual quota grant logic
		_ = topUpID
	}

	c.JSON(http.StatusOK, gin.H{"received": true})
}

// SearchMadaPayments queries payment history (admin only)
func SearchMadaPayments(c *gin.Context) {
	userId := c.Query("user_id")
	status := c.Query("status")

	common.SysLog(fmt.Sprintf("MADA payment search: user=%s status=%s", userId, status))

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    []interface{}{}, // stub
	})
}

// ——— GrabPay (东南亚: 印尼/泰国/马来西亚/新加坡/菲律宾/越南) ———

// GrabPayPaymentRequest represents a GrabPay payment
type GrabPayPaymentRequest struct {
	Amount      float64 `json:"amount"`
	Currency    string  `json:"currency"` // IDR / THB / MYR / SGD / PHP / VND
	UserID      int     `json:"user_id"`
	TopUpID     int     `json:"topup_id"`
	CountryCode string  `json:"country_code"` // ID/TH/MY/SG/PH/VN
}

// GrabPayPaymentResponse contains redirect/payment info
type GrabPayPaymentResponse struct {
	PaymentID   string `json:"payment_id"`
	RedirectURL string `json:"redirect_url"`
	QRCodeURL   string `json:"qr_code_url"`
	Amount      string `json:"amount"`
	Currency    string `json:"currency"`
	Status      string `json:"status"`
}

// CreateGrabPayPayment initiates a GrabPay payment
func CreateGrabPayPayment(c *gin.Context) {
	var req GrabPayPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiError(c, fmt.Errorf("invalid request: %w", err))
		return
	}

	if req.Amount <= 0 {
		common.ApiError(c, fmt.Errorf("amount must be positive"))
	}

	userID := c.GetInt("id")
	if req.UserID == 0 {
		req.UserID = userID
	}

	grabPaySecret := os.Getenv("GRABPAY_SECRET_KEY")
	grabPayBase := os.Getenv("GRABPAY_BASE_URL")
	if grabPayBase == "" {
		grabPayBase = "https://api.grab.com/grabpay/partner/v2"
	}

	paymentID := fmt.Sprintf("grabpay_%d_%d", req.UserID, time.Now().UnixMilli())

	// ⚠️ 生产环境：实际调用 GrabPay API
	_ = grabPaySecret

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": GrabPayPaymentResponse{
			PaymentID:   paymentID,
			RedirectURL: fmt.Sprintf("%s/charge/init?paymentId=%s", grabPayBase, paymentID),
			Amount:      fmt.Sprintf("%.2f", req.Amount),
			Currency:    req.Currency,
			Status:      "pending_redirect",
		},
	})
}

// GrabPayWebhook handles callbacks from GrabPay
func GrabPayWebhook(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cannot read body"})
		return
	}

	var webhook map[string]interface{}
	if err := json.Unmarshal(body, &webhook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	status, _ := webhook["status"].(string)
	txID := fmt.Sprintf("%v", webhook["txID"])

	switch status {
	case "success", "completed":
		amount, _ := strconv.ParseFloat(fmt.Sprintf("%v", webhook["amount"]), 64)
		common.SysLog(fmt.Sprintf("GrabPay payment success: tx=%s amount=%.2f", txID, amount))
		// model.GrantQuota(topUpID, amount)
	case "failed", "cancelled":
		common.SysLog(fmt.Sprintf("GrabPay payment %s: tx=%s", status, txID))
	}

	c.JSON(http.StatusOK, gin.H{"received": true})
}

// ——— Midtrans (印尼统一网关: GoPay/OVO/BCA/Mandiri) ———

// CreateMidtransPayment initiates a Midtrans payment (Indonesia multi-channel)
func CreateMidtransPayment(c *gin.Context) {
	var req struct {
		Amount     float64 `json:"amount"`
		PaymentMethod string `json:"payment_method"` // gopay / ovo / bca_va / mandiri_va
		UserID     int     `json:"user_id"`
		TopUpID    int     `json:"topup_id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		common.ApiError(c, err)
		return
	}

	midtransServerKey := os.Getenv("MIDTRANS_SERVER_KEY")
	midtransBase := os.Getenv("MIDTRANS_BASE_URL")
	if midtransBase == "" {
		midtransBase = "https://api.sandbox.midtrans.com/v2"
	}

	paymentID := fmt.Sprintf("midtrans_%d_%d", req.UserID, time.Now().UnixMilli())
	_ = midtransServerKey

	// Build payment method specific params
	var paymentPayload map[string]interface{}
	switch req.PaymentMethod {
	case "gopay":
		paymentPayload = map[string]interface{}{"enable_callback": true}
	case "ovo":
		paymentPayload = map[string]interface{}{}
	default:
		paymentPayload = map[string]interface{}{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"payment_id":    paymentID,
			"amount":        fmt.Sprintf("%.2f", req.Amount),
			"currency":      "IDR",
			"method":        req.PaymentMethod,
			"status":        "pending",
			"payment_payload": paymentPayload,
		},
	})
}

// MidtransWebhook handles Midtrans payment notifications
func MidtransWebhook(c *gin.Context) {
	body, _ := io.ReadAll(c.Request.Body)
	var webhook map[string]interface{}
	json.Unmarshal(body, &webhook)

	transactionStatus, _ := webhook["transaction_status"].(string)
	orderID := fmt.Sprintf("%v", webhook["order_id"])

	if transactionStatus == "settlement" || transactionStatus == "capture" {
		common.SysLog(fmt.Sprintf("Midtrans payment success: order=%s", orderID))
	}

	c.JSON(http.StatusOK, gin.H{"received": true})
}

