import localforage from 'localforage';

// Configure localforage to use IndexedDB
const notesStore = localforage.createInstance({
  name: 'gbvsr-matchup-notes',
  storeName: 'notes',
});

const settingsStore = localforage.createInstance({
  name: 'gbvsr-matchup-notes',
  storeName: 'settings',
});

export interface Note {
  id: number;
  character_name: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Config {
  app: {
    name: string;
    version: string;
    author: string;
    repository: string;
  };
  colors: {
    light: string;
    medium: string;
    heavy: string;
    ultimate: string;
    skill: string;
  };
  ui: {
    characterOverlayOpacity: number;
  };
}

// Hardcoded config (previously from Go backend)
const config: Config = {
  app: {
    name: 'GBVSR Matchup Notes',
    version: '1.0.0',
    author: 'Developer Name',
    repository: 'https://github.com/yourusername/gbvsr-matchup-notes',
  },
  colors: {
    light: '#DE7CD1',
    medium: '#16df53',
    heavy: '#ff6b6b',
    ultimate: '#1ba6ff',
    skill: '#ffe370',
  },
  ui: {
    characterOverlayOpacity: 0.6,
  },
};

// Note operations
export const GetConfig = async (): Promise<Config> => {
  return config;
};

export const GetNotesByCharacter = async (characterName: string): Promise<Note[]> => {
  const allNotes = await getAllNotes();
  return allNotes
    .filter((note) => note.character_name === characterName)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
};

export const CreateNote = async (note: Omit<Note, 'id'>): Promise<Note> => {
  const allNotes = await getAllNotes();
  const newId = allNotes.length > 0 ? Math.max(...allNotes.map((n) => n.id)) + 1 : 1;
  
  const newNote: Note = {
    ...note,
    id: newId,
  };
  
  allNotes.push(newNote);
  await notesStore.setItem('all_notes', allNotes);
  return newNote;
};

export const UpdateNote = async (note: Note): Promise<void> => {
  const allNotes = await getAllNotes();
  const index = allNotes.findIndex((n) => n.id === note.id);
  
  if (index !== -1) {
    allNotes[index] = {
      ...note,
      updated_at: new Date().toISOString(),
    };
    await notesStore.setItem('all_notes', allNotes);
  }
};

export const DeleteNote = async (id: number): Promise<void> => {
  const allNotes = await getAllNotes();
  const filtered = allNotes.filter((n) => n.id !== id);
  await notesStore.setItem('all_notes', filtered);
};

export const SearchNotes = async (characterName: string, query: string): Promise<Note[]> => {
  const characterNotes = await GetNotesByCharacter(characterName);
  const lowerQuery = query.toLowerCase();
  
  return characterNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery)
  );
};

// Settings operations
export const GetExModeEnabled = async (): Promise<boolean> => {
  const value = await settingsStore.getItem<string>('ex_mode_enabled');
  return value === 'true';
};

export const SetExModeEnabled = async (enabled: boolean): Promise<void> => {
  await settingsStore.setItem('ex_mode_enabled', enabled ? 'true' : 'false');
};

export const GetSetting = async (key: string): Promise<string> => {
  return (await settingsStore.getItem<string>(key)) || '';
};

export const SetSetting = async (key: string, value: string): Promise<void> => {
  await settingsStore.setItem(key, value);
};

// Helper function
const getAllNotes = async (): Promise<Note[]> => {
  const notes = await notesStore.getItem<Note[]>('all_notes');
  return notes || [];
};

// Character list
export const GetCharacterList = (): string[] => {
  return [
    // Row 1
    'zeta', 'vaseraga', 'beatrix', 'eustace', 'anre', 'seox', 'lancelot', 'vane', 'percival', 'siegfried',
    // Row 2
    'versusia', 'zooey', 'ladiva', 'narmaya', 'gran', 'djeeta', 'charlotta', 'ferry', 'anila', 'vikala',
    // Row 3
    'galleon', 'grimnir', 'metera', 'lowain', 'katalina', 'vira', 'yuel', 'soriz', 'cagliostro', 'wilnas',
    // Row 4
    'ilsa', 'sandalphon', 'nier', 'belial', 'beelzebub', 'lucilius', 'avatar belial', '2B', 'meg',
    // EX variants
    'narmaya_ex', 'gran_ex', 'djeeta_ex',
  ];
};

export const GetExCharacters = (): string[] => {
  return ['narmaya', 'gran', 'djeeta'];
};
