package service

import (
	"fmt"
	"gbvsr-matchup-notes/internal/models"
	"gbvsr-matchup-notes/internal/repository"
	"time"
)

// NoteService handles business logic for notes
type NoteService struct {
	repo repository.NoteRepository
}

// NewNoteService creates a new note service
func NewNoteService(repo repository.NoteRepository) *NoteService {
	return &NoteService{repo: repo}
}

// CreateNote creates a new note with timestamps
func (s *NoteService) CreateNote(note *models.Note) error {
	now := time.Now()
	note.CreatedAt = now
	note.UpdatedAt = now
	
	return s.repo.Create(note)
}

// GetNoteByID retrieves a note by ID
func (s *NoteService) GetNoteByID(id int64) (*models.Note, error) {
	return s.repo.GetByID(id)
}

// GetNotesByCharacter retrieves all notes for a character
func (s *NoteService) GetNotesByCharacter(characterName string) ([]*models.Note, error) {
	if characterName == "" {
		return nil, fmt.Errorf("character name is required")
	}
	return s.repo.GetByCharacter(characterName)
}

// UpdateNote updates an existing note
func (s *NoteService) UpdateNote(note *models.Note) error {
	if note.ID == 0 {
		return fmt.Errorf("note ID is required")
	}
	return s.repo.Update(note)
}

// DeleteNote deletes a note by ID
func (s *NoteService) DeleteNote(id int64) error {
	if id == 0 {
		return fmt.Errorf("note ID is required")
	}
	return s.repo.Delete(id)
}

// SearchNotes searches notes for a character
func (s *NoteService) SearchNotes(characterName, query string) ([]*models.Note, error) {
	if characterName == "" {
		return nil, fmt.Errorf("character name is required")
	}
	if query == "" {
		// If no query, return all notes for character
		return s.repo.GetByCharacter(characterName)
	}
	return s.repo.Search(characterName, query)
}
