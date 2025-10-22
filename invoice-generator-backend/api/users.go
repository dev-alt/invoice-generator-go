package api

import (
	"log"
	"net/http"
	"strings"
	"time"

	"invoice-generator-go/models"
	"invoice-generator-go/storage"
	"invoice-generator-go/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func registerUser(c *gin.Context) {
	var tempUser struct {
		Email       string `json:"email"`
		Password    string `json:"password"` // Temporary field to receive the password
		CompanyName string `json:"company_name"`
	}

	if err := c.ShouldBindJSON(&tempUser); err != nil {
		log.Printf("Registration failed - Invalid JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Validate and sanitize email
	if err := utils.ValidateEmail(tempUser.Email); err != nil {
		log.Printf("Registration failed - Invalid email: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	tempUser.Email = strings.ToLower(strings.TrimSpace(tempUser.Email))

	// Validate password strength
	if err := utils.ValidatePassword(tempUser.Password); err != nil {
		log.Printf("Registration failed - Weak password")
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Sanitize company name
	if tempUser.CompanyName != "" {
		tempUser.CompanyName = utils.SanitizeString(tempUser.CompanyName, 255)
		if err := utils.ValidateStringLength(tempUser.CompanyName, "company name", 1, 255); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	log.Printf("Registration attempt for email: %s", tempUser.Email)

	// Hash the password
	hashedPassword, err := utils.HashPassword(tempUser.Password)
	if err != nil {
		log.Printf("Registration failed - Password hashing error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password", "details": err.Error()})
		return
	}

	log.Printf("Password hashed successfully (length: %d)", len(hashedPassword))

	// Create new user with provided details
	now := time.Now()
	newUser := models.User{
		ID:           uuid.New(),
		Email:        tempUser.Email,
		PasswordHash: hashedPassword,
		CompanyName:  tempUser.CompanyName,
		CreatedAt:    now,
		UpdatedAt:    now,
	}

	log.Printf("Attempting to create user with ID: %s, Email: %s", newUser.ID, newUser.Email)

	// Save the user to the database
	userID, err := storage.CreateUser(&newUser)
	if err != nil {
		log.Printf("Registration failed - Database error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create user",
			"details": err.Error(),
		})
		return
	}

	log.Printf("User created successfully with ID: %s", userID)
	c.JSON(http.StatusCreated, gin.H{"message": "User registered", "user_id": userID})
}

func loginUser(c *gin.Context) {
	var loginDetails struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginDetails); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Validate and sanitize email
	if err := utils.ValidateEmail(loginDetails.Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
		return
	}
	loginDetails.Email = strings.ToLower(strings.TrimSpace(loginDetails.Email))

	// Basic password length check
	if len(loginDetails.Password) < 1 || len(loginDetails.Password) > 128 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	user, err := storage.GetUserByEmail(loginDetails.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if !utils.CheckPasswordHash(loginDetails.Password, user.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := utils.GenerateJWT(user.ID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
