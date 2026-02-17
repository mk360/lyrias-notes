import React, { useState } from 'react';
import { Note } from '../../types';
import { SearchNotes } from '../../../wailsjs/go/main/App';

interface NotesListProps {
  notes: Note[];
  characterName: string;
  onCreateNote: () => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: number) => void;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  characterName,
  onCreateNote,
  onEditNote,
  onDeleteNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Note[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const results = await SearchNotes(characterName, query);
      setSearchResults(results || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const displayNotes = searchResults !== null ? searchResults : notes;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Notes</h2>
          <button
            onClick={onCreateNote}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            New Note
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search notes (title and content)..."
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        {searchResults !== null && (
          <div className="mt-2 text-sm text-gray-600">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {displayNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            {searchResults !== null ? (
              <>
                <p className="text-lg mb-2">No notes found</p>
                <p className="text-sm">Try a different search term</p>
              </>
            ) : (
              <>
                <p className="text-lg mb-2">No notes yet</p>
                <p className="text-sm mb-4">Create your first note for {characterName}</p>
                <button
                  onClick={onCreateNote}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Note
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {displayNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 hover:bg-gray-50 cursor-pointer group"
                onClick={() => onEditNote(note)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600">
                    {note.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 px-2 py-1 rounded transition-opacity"
                    title="Delete note"
                  >
                    🗑️
                  </button>
                </div>

                {/* Note Preview */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {stripHtml(note.content)}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Updated: {formatDate(note.updated_at)}</span>
                  {note.created_at !== note.updated_at && (
                    <span>Created: {formatDate(note.created_at)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;