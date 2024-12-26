package storage

import (
	"database/sql"
	"fmt"
	"invoice-generator-go/models"
)

func CreateTemplate(template models.Template) (uint, error) {
	var id uint
	err := DB.QueryRow(`
        INSERT INTO templates (user_id, name, content)
        VALUES ($1, $2, $3)
        RETURNING id
    `, template.UserID, template.Name, template.Content).Scan(&id)

	if err != nil {
		return 0, err
	}

	return id, nil
}

// GetTemplateByID retrieves a template by its ID from the database.
func GetTemplateByID(templateID int) (*models.Template, error) {
	var template models.Template
	err := DB.QueryRow(`
        SELECT id, user_id, name, content, created_at
        FROM templates
        WHERE id = $1
    `, templateID).Scan(&template.ID, &template.UserID, &template.Name, &template.Content, &template.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			// Handle the case where no template with the given ID is found
			return nil, fmt.Errorf("template with ID %d not found", templateID)
		}
		// Handle other potential database errors
		return nil, fmt.Errorf("error querying template by ID: %v", err)
	}

	return &template, nil
}

func GetTemplatesByUserID(userID uint) ([]models.Template, error) {
	rows, err := DB.Query(`
        SELECT id, name, content, created_at
        FROM templates
        WHERE user_id = $1
    `, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var templates []models.Template
	for rows.Next() {
		var t models.Template
		if err := rows.Scan(&t.ID, &t.Name, &t.Content, &t.CreatedAt); err != nil {
			return nil, err
		}
		templates = append(templates, t)
	}

	return templates, nil
}
