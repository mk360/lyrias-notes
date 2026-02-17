# Development Guide

## Next Steps for Implementation

This scaffold provides the foundational architecture. Here's what needs to be completed:

### 1. Complete Character View (HIGH PRIORITY)

**File:** `frontend/src/components/CharacterView.tsx` (needs creation)

Implement the split panel layout with:
- Left panel (75%): Notes list + TipTap editor
- Right panel (25%): Frame data display
- Draggable divider

**Components needed:**
- `SplitPanel.tsx` - Resizable split container
- `NotesList.tsx` - Display and search notes
- `NoteEditor.tsx` - TipTap rich text editor
- `FrameDataPanel.tsx` - Display character frame data

### 2. TipTap Editor Integration (HIGH PRIORITY)

**File:** `frontend/src/components/NoteEditor/NoteEditor.tsx`

Implement:
- TipTap editor with all extensions
- Custom toolbar with color buttons
- Image upload/paste handling
- Font size selector
- Input notation picker dropdown

**Extensions needed:**
- StarterKit (bold, italic, headings, etc.)
- Color + TextStyle
- Image
- Link
- Custom extension for input notation syntax highlighting

### 3. Input Notation System (MEDIUM PRIORITY)

**Files:**
- `frontend/src/utils/notationParser.ts` (expand current stub)
- `frontend/src/components/NoteEditor/InputNotationExtension.ts` (create)
- `frontend/src/components/NoteEditor/InputNotationPicker.tsx` (create)

Implement:
- Complete regex pattern matching for all notation types
- Color application logic based on button strength
- TipTap extension for real-time syntax highlighting
- Input picker UI (directionals + buttons + "Add" button)

**Patterns to handle:**
```
236H          -> single color
c.M           -> single color
j.236L        -> single color
[4]6U         -> single color
5S+M          -> single color
236S          -> skill color
236S+U        -> multi-color (S=skill, U=ultimate)
M+H           -> multi-color (each button separate)
L+M+H         -> multi-color (each button separate)
RS            -> uncolored
5L > 5L > 5H  -> multiple tokens
```

### 4. Frame Data Scraper (MEDIUM PRIORITY)

**File:** `internal/scraper/dustloop_scraper.go`

Implement web scraping for Dustloop:
- HTTP client to fetch character pages
- HTML parsing (use `goquery` library)
- Extract move data (name, image, frame data)
- Parse frame data tables
- Store in SQLite

**Example URL:** `https://dustloop.com/w/GBVSR/Vira`

### 5. Frame Data Display (MEDIUM PRIORITY)

**File:** `frontend/src/components/FrameData/FrameDataPanel.tsx`

Display:
- Character portrait
- List of moves with images
- Frame data tables for each move
- Scrollable content

### 6. Repository Pattern for Frame Data (MEDIUM PRIORITY)

**Files:**
- `internal/repository/frame_data_repository.go` (create)
- `internal/service/frame_data_service.go` (create)

Implement CRUD operations for frame data similar to notes.

### 7. Image Handling in Notes (LOW PRIORITY)

**Files:**
- Update `NoteEditor.tsx` to handle image uploads
- Implement base64 encoding
- Add image paste from clipboard support

### 8. UI Polish (LOW PRIORITY)

- Loading states
- Error messages
- Animations
- Better styling
- Responsive design adjustments

### 9. Testing (FUTURE)

- Unit tests for Go services
- Integration tests for repositories
- React component tests
- E2E tests with Wails

## Architecture Decisions Made

### Backend (Go)

1. **Repository Pattern:** All database access goes through repositories
   - Makes it easy to swap implementations
   - Testable with mocks

2. **Service Layer:** Business logic separated from data access
   - Validation happens here
   - Timestamp management
   - Complex operations

3. **Singleton Config:** Thread-safe configuration loading
   - Lazy initialization
   - Single source of truth

### Frontend (React)

1. **Context API for Global State:** Simple and effective
   - Config loaded once on startup
   - EX mode state shared across components

2. **Custom Hooks:** Encapsulate data fetching logic
   - `useNotes` - All note operations
   - `useUpdateCheck` - Update checking
   - Reusable and testable

3. **Component Structure:**
   - Presentational components (dumb, stateless)
   - Container components (smart, with hooks)
   - Clear separation of concerns

## Code Style Guidelines

### Go
- Follow standard Go conventions
- Use `gofmt` for formatting
- Error handling: always check and return errors
- Comments on exported functions

### TypeScript/React
- Use functional components
- TypeScript strict mode enabled
- Props interfaces for all components
- Descriptive variable names

### Naming Conventions
- Go: `PascalCase` for exported, `camelCase` for private
- TypeScript: `PascalCase` for components, `camelCase` for functions/variables
- CSS: `kebab-case` for class names

## Common Patterns

### Adding a New Go Method (exposed to frontend)

1. Add method to `App` struct in `app.go`
2. Implement business logic (usually delegates to service)
3. Wails automatically generates TypeScript bindings
4. Use in React: `await window.go.main.App.MethodName(params)`

### Adding a New React Component

1. Create component file in appropriate directory
2. Define props interface
3. Export as named export
4. Import and use in parent component

### Database Queries

1. Add method to repository interface
2. Implement in repository struct
3. Call from service layer
4. Service method exposed via App struct

## Debugging Tips

### Backend
- Use `log.Printf()` for debugging
- Check `gbvsr_notes.db` with SQLite browser
- Wails dev mode shows Go logs in terminal

### Frontend
- React DevTools for component inspection
- Chrome DevTools for debugging
- Check Wails bindings in `window.go`

### Common Issues

**Wails bindings not working:**
- Make sure method is on `App` struct
- Method must be exported (PascalCase)
- Rebuild: `wails dev` should regenerate bindings

**Database locked:**
- Close any SQLite browsers
- Check for leaked connections (missing `.Close()`)

**Frontend hot-reload not working:**
- Check Vite is running
- Restart `wails dev`

## Performance Considerations

1. **Database Indexes:** Already added for common queries
2. **Lazy Loading:** Load frame data only when viewing character
3. **Debounce Search:** Implement search debouncing (300ms)
4. **Image Optimization:** Consider image size limits (5MB)

## Security Considerations

1. **SQL Injection:** Using parameterized queries (✓)
2. **XSS:** React escapes by default (✓)
3. **File Paths:** Validate user input before file operations
4. **GitHub API:** Rate limiting handled (✓)

## Deployment Checklist

Before releasing:
- [ ] Test on Windows and Linux
- [ ] Verify all assets are bundled
- [ ] Update version in `wails.json` and `config.go`
- [ ] Test update checker
- [ ] Create GitHub release notes
- [ ] Tag release: `git tag v1.0.0`
- [ ] Push tag: `git push origin v1.0.0`
- [ ] Verify GitHub Actions build
- [ ] Test downloaded artifacts

## Useful Commands

```bash
# Development
wails dev                    # Run with hot reload
wails build                  # Build for current platform
wails doctor                 # Check environment

# Frontend only
cd frontend && npm run dev   # Run frontend in browser
cd frontend && npm run build # Build frontend

# Database
sqlite3 gbvsr_notes.db ".schema"  # View schema
sqlite3 gbvsr_notes.db ".tables"  # List tables

# Git
git tag v1.0.0              # Create tag
git push origin v1.0.0      # Push tag (triggers CI)
```

## Resources

- [Wails Documentation](https://wails.io/docs/introduction)
- [TipTap Documentation](https://tiptap.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Dustloop Wiki](https://dustloop.com/w/GBVSR)

---

Happy coding! 🎮
