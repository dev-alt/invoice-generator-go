package utils

import (
	"fmt"
	"time"
)

// GenerateInvoiceNumber creates a unique invoice number
// Format: INV-YYYYMMDD-XXXXXX (where X is a sequential number)
func GenerateInvoiceNumber() string {
	now := time.Now()
	dateStr := now.Format("20060102") // YYYYMMDD format

	// Use timestamp microseconds for uniqueness
	microsec := now.UnixMicro() % 1000000

	return fmt.Sprintf("INV-%s-%06d", dateStr, microsec)
}

// GenerateInvoiceNumberWithPrefix creates an invoice number with custom prefix
func GenerateInvoiceNumberWithPrefix(prefix string) string {
	now := time.Now()
	dateStr := now.Format("20060102")
	microsec := now.UnixMicro() % 1000000

	if prefix == "" {
		prefix = "INV"
	}

	return fmt.Sprintf("%s-%s-%06d", prefix, dateStr, microsec)
}
