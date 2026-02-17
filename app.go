package main

import (
	"context"
	"database/sql"
	"fmt"
	"gbvsr-matchup-notes/internal/config"
	"gbvsr-matchup-notes/internal/database"
	"gbvsr-matchup-notes/internal/models"
	"gbvsr-matchup-notes/internal/repository"
	"gbvsr-matchup-notes/internal/service"
	"log"
	"os"
	"path/filepath"
)

// App struct
type App struct {
	ctx            context.Context
	db             *sql.DB
	noteService    *service.NoteService
	settingService *service.SettingService
	updateService  *service.UpdateService
	config         *config.Config
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.config = config.GetConfig()

	// Get user data directory
	dbPath, err := getDBPath()
	if err != nil {
		log.Fatalf("Failed to get database path: %v", err)
	}

	// Initialize database
	db, err := database.InitDB(dbPath)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	a.db = db

	// Initialize repositories
	noteRepo := repository.NewNoteRepository(db)
	settingRepo := repository.NewSettingRepository(db)

	// Initialize services
	a.noteService = service.NewNoteService(noteRepo)
	a.settingService = service.NewSettingService(settingRepo)
	a.updateService = service.NewUpdateService()

	// Silent update check on startup
	go func() {
		_, err := a.updateService.CheckForUpdates()
		if err != nil {
			// Fail silently on startup
			log.Printf("Silent update check failed: %v", err)
		}
	}()
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	if a.db != nil {
		a.db.Close()
	}
}

// GetConfig returns the application configuration
func (a *App) GetConfig() (*config.Config, error) {
	return a.config, nil
}

// ============================================================================
// Note Methods (exposed to frontend)
// ============================================================================

// CreateNote creates a new note
func (a *App) CreateNote(note models.Note) error {
	return a.noteService.CreateNote(&note)
}

// GetNoteByID retrieves a note by ID
func (a *App) GetNoteByID(id int64) (*models.Note, error) {
	return a.noteService.GetNoteByID(id)
}

// GetNotesByCharacter retrieves all notes for a character
func (a *App) GetNotesByCharacter(characterName string) ([]*models.Note, error) {
	return a.noteService.GetNotesByCharacter(characterName)
}

// UpdateNote updates an existing note
func (a *App) UpdateNote(note models.Note) error {
	return a.noteService.UpdateNote(&note)
}

// DeleteNote deletes a note
func (a *App) DeleteNote(id int64) error {
	return a.noteService.DeleteNote(id)
}

// SearchNotes searches notes for a character
func (a *App) SearchNotes(characterName, query string) ([]*models.Note, error) {
	return a.noteService.SearchNotes(characterName, query)
}

// ============================================================================
// Setting Methods (exposed to frontend)
// ============================================================================

// GetSetting retrieves a setting value
func (a *App) GetSetting(key string) (string, error) {
	return a.settingService.GetSetting(key)
}

// SetSetting sets a setting value
func (a *App) SetSetting(key, value string) error {
	return a.settingService.SetSetting(key, value)
}

// GetExModeEnabled gets the EX mode state
func (a *App) GetExModeEnabled() (bool, error) {
	return a.settingService.GetExModeEnabled()
}

// SetExModeEnabled sets the EX mode state
func (a *App) SetExModeEnabled(enabled bool) error {
	return a.settingService.SetExModeEnabled(enabled)
}

// ============================================================================
// Update Methods (exposed to frontend)
// ============================================================================

// CheckForUpdates checks for application updates
func (a *App) CheckForUpdates() (*models.UpdateInfo, error) {
	return a.updateService.CheckForUpdates()
}

// ============================================================================
// Character Data (exposed to frontend)
// ============================================================================

// GetCharacterList returns the list of all characters
func (a *App) GetCharacterList() []string {
	return []string{
		// Row 1
		"zeta", "vaseraga", "beatrix", "eustace", "anre", "seox", "lancelot", "vane", "percival", "siegfried",
		// Row 2
		"versusia", "zooey", "ladiva", "narmaya", "gran", "djeeta", "charlotta", "ferry", "anila", "vikala",
		// Row 3
		"galleon", "grimnir", "metera", "lowain", "katalina", "vira", "yuel", "soriz", "cagliostro", "wilnas",
		// Row 4
		"ilsa", "sandalphon", "nier", "belial", "beelzebub", "lucilius", "avatar belial", "2B", "meg",
		// EX variants
		"narmaya_ex", "gran_ex", "djeeta_ex",
	}
}

// GetExCharacters returns the list of characters with EX variants
func (a *App) GetExCharacters() []string {
	return []string{"narmaya", "gran", "djeeta"}
}

// Greet returns a greeting for the given name
// This is a placeholder method from the Wails template - can be removed
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// ============================================================================
// Helper Functions
// ============================================================================

// getDBPath returns the platform-specific path for the SQLite database
// Windows: %APPDATA%/gbvsr-matchup-notes/data.db
// Linux: ~/.config/gbvsr-matchup-notes/data.db
func getDBPath() (string, error) {
	var appDataDir string

	// Get platform-specific user config directory
	userConfigDir, err := os.UserConfigDir()
	if err != nil {
		return "", fmt.Errorf("failed to get user config directory: %w", err)
	}

	// Create app-specific directory
	appDataDir = filepath.Join(userConfigDir, "gbvsr-matchup-notes")

	// Ensure directory exists
	if err := os.MkdirAll(appDataDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create app data directory: %w", err)
	}

	// Return full database path
	dbPath := filepath.Join(appDataDir, "data.db")
	log.Printf("Database path: %s", dbPath)

	return dbPath, nil
}
