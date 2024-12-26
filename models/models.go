package models

import "time"

type User struct {
	ID           uint      `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // Exclude from JSON responses
	CreatedAt    time.Time `json:"created_at"`
}

type Invoice struct {
	ID            uint      `json:"id"`
	UserID        uint      `json:"user_id"`
	InvoiceNumber string    `json:"invoice_number"`
	CreatedAt     time.Time `json:"created_at"`
	TemplateID    int       `json:"template_id"`
	Status        string    `json:"status"`
}

type Template struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	Name      string    `json:"name"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}
