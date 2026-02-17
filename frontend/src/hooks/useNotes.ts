import { useState, useEffect, useCallback } from 'react';
import { models } from '../../wailsjs/go/models';
import { GetNotesByCharacter, CreateNote, UpdateNote, DeleteNote, SearchNotes } from '../../wailsjs/go/main/App';

export const useNotes = (characterName: string) => {
  const [notes, setNotes] = useState<models.Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!characterName) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await GetNotesByCharacter(characterName);
      setNotes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  }, [characterName]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (note: Omit<models.Note, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newNote = new models.Note({
        id: 0,
        character_name: note.character_name,
        title: note.title,
        content: note.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      await CreateNote(newNote);
      await fetchNotes();
    } catch (err) {
      console.error('Failed to create note:', err);
      throw err;
    }
  };

  const updateNote = async (note: models.Note) => {
    try {
      await UpdateNote(note);
      await fetchNotes();
    } catch (err) {
      console.error('Failed to update note:', err);
      throw err;
    }
  };

  const deleteNote = async (id: number) => {
    try {
      await DeleteNote(id);
      await fetchNotes();
    } catch (err) {
      console.error('Failed to delete note:', err);
      throw err;
    }
  };

  const searchNotes = async (query: string) => {
    if (!characterName) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await SearchNotes(characterName, query);
      setNotes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search notes');
      console.error('Failed to search notes:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    refetch: fetchNotes,
  };
};