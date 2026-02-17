# GBVSR Matchup Notes

A desktop application for managing matchup notes for Granblue Fantasy Versus Rising with integrated frame data from Dustloop.

## Features

- ✅ **Character Select Grid** - Mirrors the in-game character select screen
- ✅ **EX Mode Toggle** - Switch between normal and EX character variants
- ✅ **Rich Text Notes** - Create, edit, and delete notes with markdown support
- ✅ **Input Notation System** - Syntax highlighting for fighting game notation (236H, c.M, etc.)
- ✅ **Frame Data Integration** - View character frame data from Dustloop
- ✅ **Search & Filter** - Find notes quickly by title or content
- ✅ **Auto-Update Check** - Notification system for new releases
- ✅ **Offline-First** - All data stored locally in SQLite

## Tech Stack

- **Backend:** Go + Wails v2
- **Frontend:** React + TypeScript + TailwindCSS
- **Editor:** TipTap (rich text with markdown)
- **Database:** SQLite
- **Platforms:** Windows, Linux

## Prerequisites

- Go 1.21 or higher
- Node.js 18 or higher
- npm or yarn
- Wails v2 CLI

### Installing Wails

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

### Platform-Specific Dependencies

**Linux:**
```bash
sudo apt-get install libgtk-3-dev libwebkit2gtk-4.0-dev
```

**Windows:**
- No additional dependencies required

## Development Setup

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/gbvsr-matchup-notes.git
cd gbvsr-matchup-notes
```

2. **Install frontend dependencies:**
```bash
cd frontend
npm install
cd ..
```

3. **Run in development mode:**
```bash
wails dev
```

The application will open in a window with hot-reload enabled.

## Building

### Build for your current platform:
```bash
wails build
```

### Build for specific platforms:
```bash
# Windows
wails build -platform windows/amd64

# Linux
wails build -platform linux/amd64
```

Built binaries will be in `build/bin/`

## Adding Character Assets

Character images should be placed in:
```
frontend/src/assets/characters/
  gran.png
  gran_ex.png
  djeeta.png
  djeeta_ex.png
  narmaya.png
  narmaya_ex.png
  ... (all 39 base characters)
```

Move images should be placed in:
```
frontend/src/assets/moves/
  gran/
    5L.png
    5M.png
    ...
  gran_ex/
    5L.png
    ...
```

EX toggle images:
```
frontend/src/assets/
  ex_toggle_off.png
  ex_toggle_on.png
```

## Project Structure

```
gbvsr-matchup-notes/
├── internal/                 # Go backend code
│   ├── config/              # Configuration
│   ├── models/              # Data models
│   ├── repository/          # Database repositories
│   ├── service/             # Business logic
│   ├── database/            # Database initialization
│   └── scraper/             # Dustloop scraper (TODO)
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # React context
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript types
│   │   └── assets/          # Images and assets
│   └── package.json
├── .github/workflows/       # GitHub Actions
├── app.go                   # Wails app bindings
├── main.go                  # Entry point
└── wails.json              # Wails configuration
```

## Configuration

The app configuration is in `internal/config/config.go`:

```go
Colors: ColorConfig{
    Light:    "#DE7CD1",  // L button
    Medium:   "#16df53",  // M button
    Heavy:    "#ff6b6b",  // H button
    Ultimate: "#1ba6ff",  // U button
    Skill:    "#ffe370",  // S button
}
```

## Input Notation System

The app supports automatic syntax highlighting for fighting game notation:

- **Buttons:** L (Light), M (Medium), H (Heavy), U (Ultimate), S (Skill)
- **Modifiers:** c. (close), f. (far), j. (jump)
- **Directionals:** 236, 214, 623, [4]6, [2]8, etc.
- **Operators:** ~ (link), > (cancel), + (simultaneous)

**Examples:**
- `236H` → colored red (Heavy)
- `c.M` → colored green (Medium)
- `5L > 5L > 5H` → multiple colored inputs
- `M+H` → each button colored separately

## Database Schema

The app uses SQLite with three main tables:

- **notes** - User's matchup notes
- **frame_data** - Cached frame data from Dustloop
- **settings** - App settings (EX mode, etc.)

Database file: `./gbvsr_notes.db`

## GitHub Actions CI/CD

The project includes a GitHub Actions workflow that:
- Builds for Windows and Linux on tagged releases (v*.*.*)
- Creates AppImage for Linux
- Uploads artifacts to GitHub Releases

To create a release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

## Roadmap

### Implemented ✅
- Character grid with EX mode
- Notes CRUD operations
- SQLite persistence
- About dialog with update checker
- Basic project structure

### To Do 📋
- [ ] Complete TipTap editor integration
- [ ] Input notation syntax highlighting (full implementation)
- [ ] Input notation picker UI
- [ ] Split panel with draggable divider
- [ ] Frame data scraper (Dustloop)
- [ ] Frame data display panel
- [ ] Character view with notes + frame data
- [ ] Image upload/paste in notes
- [ ] Search functionality UI
- [ ] Better error handling and loading states

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Credits

- Frame data sourced from [Dustloop Wiki](https://dustloop.com/w/GBVSR)
- Built with [Wails](https://wails.io/)

---

**Note:** This is a fan-made tool and is not officially affiliated with Granblue Fantasy Versus Rising or Cygames.
