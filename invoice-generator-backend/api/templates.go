package api

import (
	_ "fmt"
	"io/ioutil"
	"net/http"
	"time"

	"invoice-generator-go/models"
	"invoice-generator-go/storage"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func uploadTemplate(c *gin.Context) {
	// Get user ID from context (set by AuthMiddleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse user ID as UUID
	userUUID, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	// Get the uploaded file
	file, err := c.FormFile("template")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Template file is required"})
		return
	}

	// Read file content
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer src.Close()

	fileBytes, err := ioutil.ReadAll(src)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
		return
	}

	// Create a new template
	template := models.Template{
		ID:        uuid.New(),
		UserID:    userUUID,
		Name:      c.PostForm("name"), // Get the template name from the form data
		Language:  c.PostForm("language"),
		Content:   string(fileBytes),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Save template to the database
	templateID, err := storage.CreateTemplate(&template)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save template"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Template uploaded", "template_id": templateID})
}

func listTemplates(c *gin.Context) {
	// Get user ID from context (set by AuthMiddleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Parse user ID as UUID
	userUUID, err := uuid.Parse(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format", "details": err.Error()})
		return
	}

	// Get templates for the user
	templates, err := storage.GetTemplatesByUserID(userUUID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve templates", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"templates": templates})
}
