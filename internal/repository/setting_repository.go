package repository

import (
	"database/sql"
	"fmt"
	"gbvsr-matchup-notes/internal/models"
)

// SettingRepository defines the interface for settings data access
type SettingRepository interface {
	Get(key string) (*models.Setting, error)
	Set(key, value string) error
	Delete(key string) error
}

type settingRepository struct {
	db *sql.DB
}

// NewSettingRepository creates a new setting repository
func NewSettingRepository(db *sql.DB) SettingRepository {
	return &settingRepository{db: db}
}

func (r *settingRepository) Get(key string) (*models.Setting, error) {
	query := `SELECT key, value FROM settings WHERE key = ?`
	
	setting := &models.Setting{}
	err := r.db.QueryRow(query, key).Scan(&setting.Key, &setting.Value)
	
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("setting not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get setting: %w", err)
	}

	return setting, nil
}

func (r *settingRepository) Set(key, value string) error {
	query := `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`
	
	_, err := r.db.Exec(query, key, value)
	if err != nil {
		return fmt.Errorf("failed to set setting: %w", err)
	}

	return nil
}

func (r *settingRepository) Delete(key string) error {
	query := `DELETE FROM settings WHERE key = ?`
	
	_, err := r.db.Exec(query, key)
	if err != nil {
		return fmt.Errorf("failed to delete setting: %w", err)
	}

	return nil
}
