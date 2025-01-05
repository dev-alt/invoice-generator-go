package api

import (
	"net/http"

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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash the password
	hashedPassword, err := utils.HashPassword(tempUser.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Create new user with provided details
	newUser := models.User{
		ID:           uuid.New(),
		Email:        tempUser.Email,
		PasswordHash: hashedPassword,
		CompanyName:  tempUser.CompanyName,
	}

	// Save the user to the database
	userID, err := storage.CreateUser(&newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered", "user_id": userID})
}

func loginUser(c *gin.Context) {
	var loginDetails struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginDetails); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
