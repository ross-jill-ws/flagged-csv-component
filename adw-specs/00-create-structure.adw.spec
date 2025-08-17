### React Component Library: FlaggedCsvComponent

We will build a React Component which takes a flagged CSV as input and renders a modern, Excel-like table using Tailwind CSS. The component should support all elements of the special flags in the input flagged CSV, including background colors, foreground colors, and cell merging.

## Core Requirements

### CSV Parsing
- **Multi-line Support**: CSV parser MUST handle quoted fields containing commas and newlines (e.g., line 30-31 in flagged.csv)
- **Character-by-Character Processing**: Use proper CSV parsing that processes character-by-character rather than splitting by newlines first
- **Escape Handling**: Support escaped quotes within quoted fields (`""` becomes `"`)

### Flagged CSV Format Support
Read `./flagged-csv.prompt.md` for the complete Flagged CSV syntax. Key formats to support:

#### Background Colors
- `{#RRGGBB}` - Original format (backward compatible)
- `{bg:#RRGGBB}` - New alias format  
- `{bc:#RRGGBB}` - Alternative alias format

#### Foreground Colors  
- `{fc:#RRGGBB}` - Text/font color

#### Cell Merging
- `{MG:XXXXXX}` - 6-digit merge identifier
- All cells with same ID should be merged into single spanning cell

#### Location Flags
- `{l:CellRef}` - Original Excel cell reference (A1, B5, AA10)

### Table Layout & Behavior

#### Column Width & Text Handling
- **Auto-sizing**: Use `table-auto` to allow columns to size based on content
- **No Text Wrapping**: Prevent unwanted text wrapping with `whitespace: nowrap`
- **Line Break Preservation**: Support explicit line breaks in data using `whitespace: pre-line` only when `\n` exists
- **Left Alignment**: All cell content should be left-aligned (`text-left`)

#### Header Behavior
- **Frozen Headers**: All header types must use `sticky top-0` positioning
  - A, B, C... column headers when first row isn't headers
  - First data row when it acts as headers (`isFirstRowHeader`)
  - Row number headers (left column)
- **Header Visibility**: Headers MUST remain visible (not grayed out) during spotlight highlighting
- **Z-index Management**: Proper layering with headers at z-20+ and highlighted cells at z-10

#### Cell Highlighting & Spotlight Effect
- **Range Support**: Support cell ranges like "A1-D1" (row ranges) and "A1-A10" (column ranges)
- **Spotlight Effect**: Non-highlighted cells get `opacity: 0.2` and `filter: brightness(0.3)`
- **Highlight Styling**: Highlighted cells get blue border and glow effect
- **Header Exclusion**: Headers (column, row, and first data row acting as headers) should NEVER be grayed out
- **Auto-scroll**: Center highlighted cells in viewport using `getBoundingClientRect` for accurate positioning

### Component Features

#### File Upload
- **Drag & Drop**: Support dragging CSV files onto component
- **Upload Button**: Traditional file picker button
- **File Validation**: Accept .csv, text/csv, and text/plain files
- **Auto-parsing**: Automatically parse uploaded content and update display

#### Excel-Style Headers
- **Row Numbers**: Display original Excel row numbers (extracted from location flags)
- **Column Letters**: A, B, C... column headers
- **Conditional Display**: Only show A,B,C headers when first row isn't already headers
- **Empty Top-Left**: Top-left cell should be empty when showing both row and column headers

### Technical Implementation

#### Parser Architecture
- **Interface Design**: 
  ```typescript
  interface CellFlags {
    color?: string;           // Background color
    foregroundColor?: string; // Text color  
    mergeId?: string;
    location?: string;
  }
  ```
- **Regex Patterns**: Use `matchAll()` for robust pattern matching of multiple color formats
- **Merge Handling**: Track merged cell boundaries and apply spanning correctly

#### React Component Structure
- **Props Interface**: 
  ```typescript
  interface FlaggedCsvComponentProps {
    csvData: string;
    highlightCells?: string[];  // Support ranges like ["A1-D1", "F1"]
    showCellLocations?: boolean;
    className?: string;
  }
  ```
- **Performance**: Use `useMemo` for parsing and `useEffect` for auto-scroll with proper timing
- **Error Handling**: Graceful handling of malformed CSV or invalid ranges

### Build Configuration
- **Dual Builds**: Separate configs for demo app (`vite.app.config.ts`) and library (`vite.config.ts`)
- **Cloudflare Compatibility**: Avoid Node.js specific imports, use relative paths
- **TypeScript**: Full type safety with proper interface exports

### Sample Data
A sample flagged CSV file is available at `./flagged.csv`

### Common Pitfalls to Avoid
1. **CSV Parsing**: Don't split by newlines first - handle quoted fields with embedded newlines
2. **Header Highlighting**: Ensure headers are excluded from spotlight graying effect
3. **Sticky Positioning**: Apply to ALL header types, not just A,B,C... headers
4. **Build Configs**: Use separate Vite configs for app vs library builds
5. **Auto-scroll**: Use `getBoundingClientRect` for accurate cell positioning, not offsetTop/offsetLeft
6. **Range Parsing**: Support both row ranges (A1-D1) and column ranges (A1-A10)
7. **Color Parsing**: Handle all background color formats and new foreground color syntax
8. **Merge Cell Colors**: Apply colors from merged cell metadata, not just individual cell flags