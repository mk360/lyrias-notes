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

export interface UpdateInfo {
  current_version: string;
  latest_version: string;
  update_url: string;
  is_update_available: boolean;
  message: string;
}

export interface FrameData {
  id: number;
  character_name: string;
  move_name: string;
  move_image_url: string;
  frame_data_json: string;
  updated_at: string;
}

export interface Character {
  name: string;
  displayName: string;
  imagePath: string;
  isEx: boolean;
}
