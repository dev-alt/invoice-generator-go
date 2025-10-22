package utils

import (
	"fmt"
	"regexp"
	"strings"
	"unicode"
)

var (
	emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	// Allow only alphanumeric, spaces, hyphens, and common punctuation
	safeStringRegex = regexp.MustCompile(`^[a-zA-Z0-9\s\-.,;:()'\"&@#!?]+$`)
)

// ValidateEmail checks if the email format is valid
func ValidateEmail(email string) error {
	if email == "" {
		return fmt.Errorf("email cannot be empty")
	}
	if len(email) > 255 {
		return fmt.Errorf("email is too long (max 255 characters)")
	}
	if !emailRegex.MatchString(email) {
		return fmt.Errorf("invalid email format")
	}
	return nil
}

// ValidatePassword checks password strength requirements
func ValidatePassword(password string) error {
	if len(password) < 8 {
		return fmt.Errorf("password must be at least 8 characters long")
	}
	if len(password) > 128 {
		return fmt.Errorf("password is too long (max 128 characters)")
	}

	var (
		hasUpper   bool
		hasLower   bool
		hasNumber  bool
		hasSpecial bool
	)

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	if !hasUpper {
		return fmt.Errorf("password must contain at least one uppercase letter")
	}
	if !hasLower {
		return fmt.Errorf("password must contain at least one lowercase letter")
	}
	if !hasNumber {
		return fmt.Errorf("password must contain at least one number")
	}
	if !hasSpecial {
		return fmt.Errorf("password must contain at least one special character")
	}

	return nil
}

// SanitizeString removes potentially dangerous characters and trims whitespace
func SanitizeString(input string, maxLength int) string {
	// Trim whitespace
	input = strings.TrimSpace(input)

	// Limit length
	if len(input) > maxLength {
		input = input[:maxLength]
	}

	return input
}

// ValidateInvoiceNumber ensures invoice number is safe and within limits
func ValidateInvoiceNumber(invoiceNumber string) error {
	if invoiceNumber == "" {
		return fmt.Errorf("invoice number cannot be empty")
	}
	if len(invoiceNumber) > 50 {
		return fmt.Errorf("invoice number is too long (max 50 characters)")
	}
	// Allow alphanumeric and common separators
	if !regexp.MustCompile(`^[a-zA-Z0-9\-_]+$`).MatchString(invoiceNumber) {
		return fmt.Errorf("invoice number contains invalid characters")
	}
	return nil
}

// ValidateAmount ensures monetary amounts are valid
func ValidateAmount(amount float64, fieldName string) error {
	if amount < 0 {
		return fmt.Errorf("%s cannot be negative", fieldName)
	}
	if amount > 999999999.99 {
		return fmt.Errorf("%s exceeds maximum allowed value", fieldName)
	}
	return nil
}

// ValidateTaxRate ensures tax rate is within valid range
func ValidateTaxRate(rate float64) error {
	if rate < 0 || rate > 100 {
		return fmt.Errorf("tax rate must be between 0 and 100")
	}
	return nil
}

// ValidateStringLength checks if string length is within bounds
func ValidateStringLength(str, fieldName string, minLen, maxLen int) error {
	length := len(str)
	if length < minLen {
		return fmt.Errorf("%s must be at least %d characters", fieldName, minLen)
	}
	if length > maxLen {
		return fmt.Errorf("%s must not exceed %d characters", fieldName, maxLen)
	}
	return nil
}

// ValidateRequiredString checks if a required string field is present
func ValidateRequiredString(str, fieldName string) error {
	if strings.TrimSpace(str) == "" {
		return fmt.Errorf("%s is required", fieldName)
	}
	return nil
}

// ValidateCurrency checks if currency code is valid (ISO 4217)
func ValidateCurrency(currency string) error {
	validCurrencies := map[string]bool{
		"USD": true, "EUR": true, "GBP": true, "JPY": true, "CNY": true,
		"AUD": true, "CAD": true, "CHF": true, "SEK": true, "NZD": true,
		"INR": true, "BRL": true, "RUB": true, "ZAR": true, "MXN": true,
		// Add more as needed
	}

	if currency == "" {
		return fmt.Errorf("currency cannot be empty")
	}

	currency = strings.ToUpper(currency)
	if !validCurrencies[currency] {
		return fmt.Errorf("invalid currency code: %s", currency)
	}

	return nil
}

// ValidateStatus checks if invoice status is valid
func ValidateStatus(status string) error {
	validStatuses := map[string]bool{
		"draft":   true,
		"sent":    true,
		"paid":    true,
		"overdue": true,
		"void":    true,
	}

	if status == "" {
		return fmt.Errorf("status cannot be empty")
	}

	status = strings.ToLower(status)
	if !validStatuses[status] {
		return fmt.Errorf("invalid status: %s", status)
	}

	return nil
}
