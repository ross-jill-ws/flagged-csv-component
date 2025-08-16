export interface CellFlags {
  color?: string;
  mergeId?: string;
  location?: string;
}

export interface ParsedCell {
  value: string;
  flags: CellFlags;
  rowIndex: number;
  colIndex: number;
}

export interface MergedCell {
  mergeId: string;
  value: string;
  color?: string;
  startRow: number;
  endRow: number;
  startCol: number;
  endCol: number;
}

export interface ParsedCsvData {
  cells: ParsedCell[][];
  mergedCells: Map<string, MergedCell>;
  maxRow: number;
  maxCol: number;
}

export function parseFlaggedCsv(csvString: string): ParsedCsvData {
  const rows = parseCSVToRows(csvString);
  const cells: ParsedCell[][] = [];
  const mergedCellsMap = new Map<string, MergedCell>();
  
  let maxRow = 0;
  let maxCol = 0;

  rows.forEach((row, rowIndex) => {
    const parsedRow: ParsedCell[] = [];
    
    row.forEach((cellValue, colIndex) => {
      const { value, flags } = parseCellValue(cellValue);
      const cell: ParsedCell = {
        value,
        flags,
        rowIndex,
        colIndex
      };
      
      parsedRow.push(cell);
      
      if (flags.mergeId) {
        if (!mergedCellsMap.has(flags.mergeId)) {
          mergedCellsMap.set(flags.mergeId, {
            mergeId: flags.mergeId,
            value: value || '',
            color: flags.color,
            startRow: rowIndex,
            endRow: rowIndex,
            startCol: colIndex,
            endCol: colIndex
          });
        } else {
          const mergedCell = mergedCellsMap.get(flags.mergeId)!;
          if (value && !mergedCell.value) {
            mergedCell.value = value;
          }
          if (flags.color && !mergedCell.color) {
            mergedCell.color = flags.color;
          }
          mergedCell.startRow = Math.min(mergedCell.startRow, rowIndex);
          mergedCell.endRow = Math.max(mergedCell.endRow, rowIndex);
          mergedCell.startCol = Math.min(mergedCell.startCol, colIndex);
          mergedCell.endCol = Math.max(mergedCell.endCol, colIndex);
        }
      }
      
      maxCol = Math.max(maxCol, colIndex);
    });
    
    cells.push(parsedRow);
    maxRow = Math.max(maxRow, rowIndex);
  });

  return {
    cells,
    mergedCells: mergedCellsMap,
    maxRow,
    maxCol
  };
}

function parseCSVToRows(csvString: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvString.length; i++) {
    const char = csvString[i];
    const nextChar = csvString[i + 1];
    
    if (!inQuotes) {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField);
        if (currentRow.length > 0 || currentField !== '') {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentField);
        if (currentRow.length > 0 || currentField !== '') {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
        i++; // Skip the \n
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // Skip the next quote
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    }
  }
  
  // Don't forget the last field and row
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }
  
  return rows;
}

function parseCellValue(cellValue: string): { value: string; flags: CellFlags } {
  const flags: CellFlags = {};
  let cleanValue = cellValue.trim();
  
  if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
    cleanValue = cleanValue.slice(1, -1).replace(/""/g, '"');
  }
  
  const colorMatch = cleanValue.match(/\{#([A-Fa-f0-9]{6})\}/g);
  if (colorMatch) {
    colorMatch.forEach(match => {
      const color = match.match(/\{#([A-Fa-f0-9]{6})\}/);
      if (color) {
        flags.color = `#${color[1]}`;
        cleanValue = cleanValue.replace(match, '');
      }
    });
  }
  
  const mergeMatch = cleanValue.match(/\{MG:(\d{6})\}/g);
  if (mergeMatch) {
    mergeMatch.forEach(match => {
      const merge = match.match(/\{MG:(\d{6})\}/);
      if (merge) {
        flags.mergeId = merge[1];
        cleanValue = cleanValue.replace(match, '');
      }
    });
  }
  
  const locationMatch = cleanValue.match(/\{l:([A-Z]+\d+)\}/g);
  if (locationMatch) {
    locationMatch.forEach(match => {
      const location = match.match(/\{l:([A-Z]+\d+)\}/);
      if (location) {
        flags.location = location[1];
        cleanValue = cleanValue.replace(match, '');
      }
    });
  }
  
  return {
    value: cleanValue.trim(),
    flags
  };
}