package models

import "time"

// Note represents a matchup note for a character
type Note struct {
	ID            int64     `json:"id"`
	CharacterName string    `json:"character_name"`
	Title         string    `json:"title"`
	Content       string    `json:"content"` // HTML from TipTap
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// FrameData represents frame data for a character's move
type FrameData struct {
	ID            int64     `json:"id"`
	CharacterName string    `json:"character_name"`
	MoveName      string    `json:"move_name"`
	MoveImageURL  string    `json:"move_image_url"`
	FrameDataJSON string    `json:"frame_data_json"` // JSON blob with frame data details
	UpdatedAt     time.Time `json:"updated_at"`
}

// Setting represents a key-value setting
type Setting struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

// UpdateInfo represents update check information
type UpdateInfo struct {
	CurrentVersion string `json:"current_version"`
	LatestVersion  string `json:"latest_version"`
	UpdateURL      string `json:"update_url"`
	IsUpdateAvailable bool `json:"is_update_available"`
	Message        string `json:"message"`
}
