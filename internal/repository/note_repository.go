package repository

import (
	"database/sql"
	"fmt"
	"gbvsr-matchup-notes/internal/models"
	"time"
)

// NoteRepository defines the interface for note data access
type NoteRepository interface {
	Create(note *models.Note) error
	GetByID(id int64) (*models.Note, error)
	GetByCharacter(characterName string) ([]*models.Note, error)
	Update(note *models.Note) error
	Delete(id int64) error
	Search(characterName, query string) ([]*models.Note, error)
}

type noteRepository struct {
	db *sql.DB
}

// NewNoteRepository creates a new note repository
func NewNoteRepository(db *sql.DB) NoteRepository {
	return &noteRepository{db: db}
}

func (r *noteRepository) Create(note *models.Note) error {
	query := `INSERT INTO notes (character_name, title, content, created_at, updated_at) 
	          VALUES (?, ?, ?, ?, ?)`
	
	result, err := r.db.Exec(query, note.CharacterName, note.Title, note.Content, 
		note.CreatedAt, note.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to create note: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get last insert id: %w", err)
	}

	note.ID = id
	return nil
}

func (r *noteRepository) GetByID(id int64) (*models.Note, error) {
	query := `SELECT id, character_name, title, content, created_at, updated_at 
	          FROM notes WHERE id = ?`
	
	note := &models.Note{}
	err := r.db.QueryRow(query, id).Scan(
		&note.ID, &note.CharacterName, &note.Title, &note.Content,
		&note.CreatedAt, &note.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("note not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get note: %w", err)
	}

	return note, nil
}

func (r *noteRepository) GetByCharacter(characterName string) ([]*models.Note, error) {
	query := `SELECT id, character_name, title, content, created_at, updated_at 
	          FROM notes WHERE character_name = ? ORDER BY updated_at DESC`
	
	rows, err := r.db.Query(query, characterName)
	if err != nil {
		return nil, fmt.Errorf("failed to query notes: %w", err)
	}
	defer rows.Close()

	var notes []*models.Note
	for rows.Next() {
		note := &models.Note{}
		err := rows.Scan(
			&note.ID, &note.CharacterName, &note.Title, &note.Content,
			&note.CreatedAt, &note.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan note: %w", err)
		}
		notes = append(notes, note)
	}

	return notes, nil
}

func (r *noteRepository) Update(note *models.Note) error {
	query := `UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?`
	
	note.UpdatedAt = time.Now()
	_, err := r.db.Exec(query, note.Title, note.Content, note.UpdatedAt, note.ID)
	if err != nil {
		return fmt.Errorf("failed to update note: %w", err)
	}

	return nil
}

func (r *noteRepository) Delete(id int64) error {
	query := `DELETE FROM notes WHERE id = ?`
	
	_, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete note: %w", err)
	}

	return nil
}

func (r *noteRepository) Search(characterName, query string) ([]*models.Note, error) {
	sqlQuery := `SELECT id, character_name, title, content, created_at, updated_at 
	             FROM notes 
	             WHERE character_name = ? AND (title LIKE ? OR content LIKE ?)
	             ORDER BY updated_at DESC`
	
	searchPattern := "%" + query + "%"
	rows, err := r.db.Query(sqlQuery, characterName, searchPattern, searchPattern)
	if err != nil {
		return nil, fmt.Errorf("failed to search notes: %w", err)
	}
	defer rows.Close()

	var notes []*models.Note
	for rows.Next() {
		note := &models.Note{}
		err := rows.Scan(
			&note.ID, &note.CharacterName, &note.Title, &note.Content,
			&note.CreatedAt, &note.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan note: %w", err)
		}
		notes = append(notes, note)
	}

	return notes, nil
}
