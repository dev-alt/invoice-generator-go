package storage

import (
	"fmt"
	"invoice-generator-go/models"

	"github.com/google/uuid"
)

// CreateTemplate inserts a new template into the database.
func CreateTemplate(template *models.Template) (string, error) {
	template.ID = uuid.New()
	query := `
        INSERT INTO templates (id, user_id, name, language, background_url, logo_url, content, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
    `

	var id uuid.UUID
	err := DB.QueryRow(query, template.ID, template.UserID, template.Name, template.Language, template.BackgroundURL, template.LogoURL, template.Content, template.CreatedAt, template.UpdatedAt).Scan(&id)
	if err != nil {
		return "", fmt.Errorf("failed to insert template: %v", err)
	}

	return id.String(), nil
}

// GetTemplateByID retrieves a template by its ID from the database.
func GetTemplateByID(templateID uuid.UUID) (*models.Template, error) {
	var template models.Template
	query := `
        SELECT id, user_id, name, language, background_url, logo_url, content, created_at, updated_at
        FROM templates
        WHERE id = $1
    `
	err := DB.QueryRow(query, templateID).Scan(&template.ID, &template.UserID, &template.Name, &template.Language, &template.BackgroundURL, &template.LogoURL, &template.Content, &template.CreatedAt, &template.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to get template by ID: %v", err)
	}

	return &template, nil
}

// GetTemplatesByUserID retrieves templates by their user ID from the database.
func GetTemplatesByUserID(userID uuid.UUID) ([]models.Template, error) {
	var templates []models.Template
	query := `
        SELECT id, user_id, name, language, background_url, logo_url, content, created_at, updated_at
        FROM templates
        WHERE user_id = $1
    `
	rows, err := DB.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get templates by user ID: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var template models.Template
		if err := rows.Scan(&template.ID, &template.UserID, &template.Name, &template.Language, &template.BackgroundURL, &template.LogoURL, &template.Content, &template.CreatedAt, &template.UpdatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan template: %v", err)
		}
		templates = append(templates, template)
	}

	return templates, nil
}
