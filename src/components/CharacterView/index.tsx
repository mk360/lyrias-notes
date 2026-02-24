import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteEditor from '../NoteEditor';
import NotesList from '../NotesList';
import FrameDataPanel from '../FrameDataPanel';
import { Config } from '../../types';
import { Note, GetConfig, GetNotesByCharacter, CreateNote, UpdateNote, DeleteNote } from '../../services/storage';

interface CharacterViewProps {
  characterName: string;
}

const CharacterView: React.FC<CharacterViewProps> = ({ characterName }) => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<Config | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [splitPosition, setSplitPosition] = useState(75); // 75% left, 25% right
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    loadConfig();
    loadNotes();
  }, [characterName]);

  const loadConfig = async () => {
    try {
      const cfg = await GetConfig();
      setConfig(cfg);
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const loadNotes = async () => {
    try {
      const notesList = await GetNotesByCharacter(characterName);
      setNotes(notesList || []);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setIsEditing(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
  };

  const handleSaveNote = async (title: string, content: string) => {
    try {
      if (selectedNote) {
        // Update existing note
        const updatedNote: Note = {
          ...selectedNote,
          title,
          content,
          updated_at: new Date().toISOString(),
        };
        await UpdateNote(updatedNote);
      } else {
        // Create new note
        await CreateNote({
          character_name: characterName,
          title,
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      
      await loadNotes();
      setIsEditing(false);
      setSelectedNote(null);
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note. Please try again.');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await DeleteNote(noteId);
      await loadNotes();
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedNote(null);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const container = e.currentTarget as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // Constrain between 40% and 85%
    if (newPosition >= 40 && newPosition <= 85) {
      setSplitPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp as any);
      return () => {
        document.removeEventListener('mouseup', handleMouseUp as any);
      };
    }
  }, [isDragging]);

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen bg-gray-100 flex flex-col overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/lyrias-notes')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Back to Character Select
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-xl font-bold capitalize">{characterName}</h1>
        </div>
      </div>

      {/* Split Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Notes */}
        <div 
          className="bg-gray-50 overflow-hidden flex flex-col"
          style={{ width: `${splitPosition}%` }}
        >
          {isEditing ? (
            <NoteEditor
              note={selectedNote}
              characterName={characterName}
              config={config}
              onSave={handleSaveNote}
              onCancel={handleCancelEdit}
            />
          ) : (
            <NotesList
              notes={notes}
              characterName={characterName}
              onCreateNote={handleCreateNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
            />
          )}
        </div>

        {/* Draggable Divider */}
        <div
          className={`w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize flex-shrink-0 ${
            isDragging ? 'bg-blue-500' : ''
          }`}
          onMouseDown={handleMouseDown}
        />

        {/* Right Panel - Frame Data */}
        <div 
          className="bg-white overflow-hidden"
          style={{ width: `${100 - splitPosition}%` }}
        >
          <FrameDataPanel characterName={characterName} />
        </div>
      </div>
    </div>
  );
};

export default CharacterView;
