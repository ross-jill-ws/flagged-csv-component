# FlaggedCsvComponent - React Library

A React component library for rendering and interacting with Flagged CSV data, providing Excel-like table visualization with preserved formatting information.

## Demo

🚀 **[Try the live demo](https://flagged-csv-component.pages.dev)**

Experience the component in action with real estate portfolio data, file upload functionality, and interactive cell highlighting.

## What is Flagged CSV?

Flagged CSV is a format that extends traditional CSV to preserve visual formatting information from Excel files. This is particularly useful when converting XLSX files to CSV while maintaining critical visual context that would otherwise be lost.

The format adds special flags to cell values to represent:
- **Background colors**: `{#RRGGBB}` 
- **Merged cells**: `{MG:XXXXXX}`
- **Cell locations**: `{l:CellRef}`

For example, a cell might contain: `"Total Revenue{#BDD7EE}{MG:143777}{l:A1}"`

This format solves the problem of losing visual context when converting Excel files to CSV, making data more interpretable for AI models and data analysis tools.

**Related Project**: For converting Excel files to Flagged CSV format, see: https://github.com/ross-jill-ws/flagged-csv/tree/main

## Features

### Core Functionality
- **Flagged CSV Parsing**: Robust parser that handles multi-line quoted fields and complex CSV structures
- **Excel-like Rendering**: Table display with proper cell merging, background colors, and formatting
- **Cell Highlighting**: Spotlight effect to emphasize specific cells with darkening of non-highlighted areas
- **Auto-scroll**: Automatically centers highlighted cells in the viewport
- **File Upload**: Drag-and-drop and button upload support for CSV files

### Advanced Features
- **Excel-style Headers**: Row numbers and column letters (A, B, C...) with smart conditional display
- **Cell Range Support**: Highlight ranges like "A1-D1" or "A1-A10" 
- **Responsive Design**: Sticky headers and scrollable container
- **TypeScript**: Full type safety and IntelliSense support

## Installation

```bash
npm install flagged-csv-component
```

## Usage

### Basic Example

```tsx
import FlaggedCsvComponent from 'flagged-csv-component';

const csvData = `
Property ID{#C6E0B4}{l:A1},Address{#C6E0B4}{l:B1},Price{#C6E0B4}{l:C1}
PID-001{l:A2},123 Main St{l:B2},500000{#FCE4D6}{l:C2}
PID-002{#F2F2F2}{l:A3},456 Oak Ave{#F2F2F2}{l:B3},750000{#F2F2F2}{l:C3}
`;

function App() {
  return (
    <FlaggedCsvComponent 
      csvData={csvData}
      highlightCells={['A1', 'C2']}
      showCellLocations={false}
    />
  );
}
```

### With Range Highlighting

```tsx
<FlaggedCsvComponent 
  csvData={csvData}
  highlightCells={['A1-C1', 'A3']} // Highlight entire header row and cell A3
  className="max-w-full"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `csvData` | `string` | required | The flagged CSV data string |
| `highlightCells` | `string[]` | `[]` | Array of cell references or ranges to highlight |
| `showCellLocations` | `boolean` | `false` | Show location flags in cells for debugging |
| `className` | `string` | `''` | Additional CSS classes for the container |

### Cell Reference Format

- **Single cells**: `"A1"`, `"B5"`, `"AA10"`
- **Row ranges**: `"A1-D1"` (same row, different columns)
- **Column ranges**: `"A1-A10"` (same column, different rows)

## Flagged CSV Format Specification

### Color Flags
- Format: `{#RRGGBB}`
- Example: `{#BDD7EE}` for light blue background

### Merge Flags  
- Format: `{MG:XXXXXX}` where XXXXXX is a unique 6-digit identifier
- All cells with the same merge ID are treated as one merged cell
- Example: `{MG:143777}`

### Location Flags
- Format: `{l:CellRef}` where CellRef is the Excel-style cell reference
- Example: `{l:A1}`, `{l:B5}`, `{l:AA10}`

### Complex Example
```csv
"Sales Report{#BDD7EE}{MG:100001}{l:A1}","{MG:100001}{l:B1}","{MG:100001}{l:C1}"
"Q1{#FCE4D6}{l:A2}","Revenue{l:B2}","1000000{l:C2}"
"Q2{#FCE4D6}{l:A3}","Revenue{l:B3}","1200000{l:C3}"
```

## Development

### Prerequisites
- Node.js 18+ (use `node22 npm` commands as specified in CLAUDE.md)
- React 19

### Setup
```bash
git clone <repository-url>
cd flagged-csv
node22 npm install
```

### Available Scripts
- `node22 npm run dev` - Start development server with HMR
- `node22 npm run build` - Build for production  
- `node22 npm run preview` - Preview production build
- `node22 npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/
│   └── FlaggedCsvComponent.tsx    # Main component
├── utils/
│   ├── flaggedCsvParser.ts        # CSV parsing logic
│   └── cellRangeParser.ts         # Range expansion utilities
└── lib/
    └── index.ts                   # Library exports
```

## Demo

The repository includes a demo application showcasing:
- Real estate portfolio data with complex formatting
- File upload functionality
- Interactive cell highlighting
- Range selection examples

Run `node22 npm run dev` to see the demo in action.

## Technical Details

### CSV Parsing
The parser handles complex CSV scenarios including:
- Multi-line quoted fields
- Escaped quotes within fields
- Mixed line endings (CRLF/LF)
- Comma and newline characters within quoted strings

### Performance
- Optimized for large datasets
- Memoized parsing and cell calculations  
- Efficient re-rendering with React hooks
- Smooth scrolling with `getBoundingClientRect` positioning

### Accessibility
- Semantic table structure
- Keyboard navigation support
- Screen reader friendly headers
- High contrast highlighting

## Browser Support

- Modern browsers with ES2020+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Related Projects

- **Flagged CSV Python Library**: https://github.com/ross-jill-ws/flagged-csv/tree/main
  - Convert Excel files to Flagged CSV format
  - Command-line tools and Python API
  - Multiple output formats (CSV, HTML, Markdown)