package main

import (
	"leettrack/calculations"
	"leettrack/models"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {

	dsn := "user=postgres.furtldrpqmnfqonpskhx password=bikwoh-manhEs-xiwqo0 host=aws-0-us-east-1.pooler.supabase.com port=6543 dbname=postgres"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		PrepareStmt: false,
	})

	if err != nil {
		log.Fatal("Failed to connecct to database:", err)
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	r.POST("/sessions", func(c *gin.Context) {
		var session models.Session
		if err := c.ShouldBindJSON(&session); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error()})
			return
		}

		log.Println(session)

		if err := db.Create(&session).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, session)
	})
	r.GET(
		"/sessions",
		func(c *gin.Context) {
			userId := c.Query("userId")
			if userId == "" {
				c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
				return
			}

			pageStr := c.DefaultQuery("page", "1")
			page, err := strconv.Atoi(pageStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
				return
			}

			limit := 100
			offset := (page - 1) * limit

			var sessions []models.Session
			if err := db.Where("userid = ?", userId).Offset(offset).Limit(limit).Find(&sessions).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, sessions)
		},
	)

	r.GET(
		"/filter-by-topic",
		func(c *gin.Context) {
			topic := c.Query("topic")
			userID := c.Query("userid")

			avgScore, err := calculations.FilterByTopic(db, topic, userID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"average_score": avgScore})
		},
	)

	r.GET(
		"/top-topics",
		func(c *gin.Context) {
			n, err := strconv.Atoi(c.Query("n"))
			if err != nil || n <= 0 {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid number of topics"})
				return
			}
			weakest := c.Query("weakest") == "true"
			userID := c.Query("userid")

			topics, err := calculations.GetTopNTopicsByAverageScore(db, n, weakest, userID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"topics": topics})
		},
	)

	r.Run()
}
