package config

import (
	"encoding/json"
	"sync"
)

type Config struct {
	App    AppConfig    `json:"app"`
	Colors ColorConfig  `json:"colors"`
	UI     UIConfig     `json:"ui"`
}

type AppConfig struct {
	Name       string `json:"name"`
	Version    string `json:"version"`
	Author     string `json:"author"`
	Repository string `json:"repository"`
}

type ColorConfig struct {
	Light    string `json:"light"`
	Medium   string `json:"medium"`
	Heavy    string `json:"heavy"`
	Ultimate string `json:"ultimate"`
	Skill    string `json:"skill"`
}

type UIConfig struct {
	CharacterOverlayOpacity float64 `json:"characterOverlayOpacity"`
}

var (
	instance *Config
	once     sync.Once
)

// GetConfig returns the singleton config instance
func GetConfig() *Config {
	once.Do(func() {
		instance = &Config{
			App: AppConfig{
				Name:       "GBVSR Matchup Notes",
				Version:    "1.0.0",
				Author:     "Developer Name",
				Repository: "https://github.com/yourusername/gbvsr-matchup-notes",
			},
			Colors: ColorConfig{
				Light:    "#DE7CD1",
				Medium:   "#16df53",
				Heavy:    "#ff6b6b",
				Ultimate: "#1ba6ff",
				Skill:    "#ffe370",
			},
			UI: UIConfig{
				CharacterOverlayOpacity: 0.6,
			},
		}
	})
	return instance
}

// ToJSON converts config to JSON string
func (c *Config) ToJSON() (string, error) {
	bytes, err := json.Marshal(c)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
}
