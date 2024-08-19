package models

import (
	"encoding/json"
	"math"
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Session struct {
	gorm.Model
	UserID       string         `gorm:"column:userid" json:"userID"`
	ProblemName  string         `gorm:"column:problemname" json:"problemName"`
	Topics       pq.StringArray `gorm:"type:text[]" json:"topics"`
	TimeSpent    float64        `gorm:"column:timespent" json:"timespent"`
	TrafficLight string         `gorm:"column:trafficlight" json:"trafficlight"`
	Attempts     int            `gorm:"column:attempts" json:"attempts"`
	Accuracy     float64        `gorm:"column:accuracy" json:"accuracy"`
	Date         time.Time      `gorm:"column:date" json:"date"`
	Score        int            `gorm:"column:score" json:"score"`
}

func (session *Session) BeforeCreate(tx *gorm.DB) (err error) {
	var trafficLightScore float64
	switch session.TrafficLight {
	case "green":
		trafficLightScore = 1.0
	case "yellow":
		trafficLightScore = 0.5
	case "red":
		trafficLightScore = 0.0
	default:
		trafficLightScore = 0.0
	}

	var timeScore float64
	switch time := session.TimeSpent; {
	case time < 30.0:
		timeScore = 1.0
	case time >= 30.0:
		timeScore = math.Exp((-5.0*float64(time-30.0) + 1) / 100.0)
	default:
		timeScore = math.Exp((-5.0*float64(time-30.0) + 1) / 100.0)
	}

	if session.Attempts > 0 {
		session.Accuracy = 1.0 / float64(session.Attempts)
	} else {
		session.Accuracy = 0.0
	}

	var rawScore float64 = 100 * ((0.5 * timeScore) + (0.4 * session.Accuracy) + (0.1 * trafficLightScore))
	session.Score = int(rawScore)
	session.Date = time.Now()
	return nil
}

func (session *Session) MarshalJSON() ([]byte, error) {
	type Alias Session
	return json.Marshal(&struct {
		*Alias
	}{
		Alias: (*Alias)(session),
	})
}

func (session *Session) UnmarshalJSON(data []byte) error {
	type Alias Session
	aux := &struct {
		*Alias
	}{
		Alias: (*Alias)(session),
	}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	return nil
}

/*
typical JSON post req
{
   "problemName":"Three Sum",
   "topic":"String",
   "timeSpent": 43,
   "trafficLight": "yellow",
   "accuracy": 1
}


*/
