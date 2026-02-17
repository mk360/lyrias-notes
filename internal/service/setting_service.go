package service

import (
	"gbvsr-matchup-notes/internal/repository"
)

// SettingService handles business logic for settings
type SettingService struct {
	repo repository.SettingRepository
}

// NewSettingService creates a new setting service
func NewSettingService(repo repository.SettingRepository) *SettingService {
	return &SettingService{repo: repo}
}

// GetSetting retrieves a setting value by key
func (s *SettingService) GetSetting(key string) (string, error) {
	setting, err := s.repo.Get(key)
	if err != nil {
		return "", err
	}
	return setting.Value, nil
}

// SetSetting sets a setting value
func (s *SettingService) SetSetting(key, value string) error {
	return s.repo.Set(key, value)
}

// GetExModeEnabled gets the EX mode enabled state
func (s *SettingService) GetExModeEnabled() (bool, error) {
	value, err := s.GetSetting("ex_mode_enabled")
	if err != nil {
		// Default to false if not found
		return false, nil
	}
	return value == "true", nil
}

// SetExModeEnabled sets the EX mode enabled state
func (s *SettingService) SetExModeEnabled(enabled bool) error {
	value := "false"
	if enabled {
		value = "true"
	}
	return s.SetSetting("ex_mode_enabled", value)
}
