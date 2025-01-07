package main

import (
	"fmt"
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

	db, err := gorm.Open(postgres.Open("host=localhost user=algouser password=password dbname=algotrackr port=5432 sslmode=disable"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connecct to database:", err)
	}

	r := gin.Default()

	db.AutoMigrate(&models.Session{})

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
			pageStr := c.DefaultQuery("page", "1")
			page, err := strconv.Atoi(pageStr)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
				return
			}

			limit := 100
			offset := (page - 1) * limit

			var sessions []models.Session
			if err := db.Offset(offset).Limit(limit).Find(&sessions).Error; err != nil {
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
			avgScore, err := calculations.FilterByTopic(db, topic)
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

			topics, err := calculations.GetTopNTopicsByAverageScore(db, n, weakest)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"topics": topics})
		},
	)

	r.GET(
		"/stats",
		func(c *gin.Context) {
			scores, err := calculations.GetStats(db)
			fmt.Println(scores)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"scores": scores})
		},
	)

	r.Run()
}
