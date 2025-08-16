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
  const lines = csvString.trim().split('\n');
  const cells: ParsedCell[][] = [];
  const mergedCellsMap = new Map<string, MergedCell>();
  
  let maxRow = 0;
  let maxCol = 0;

  lines.forEach((line, rowIndex) => {
    const row: ParsedCell[] = [];
    const cellValues = splitCsvLine(line);
    
    cellValues.forEach((cellValue, colIndex) => {
      const { value, flags } = parseCellValue(cellValue);
      const cell: ParsedCell = {
        value,
        flags,
        rowIndex,
        colIndex
      };
      
      row.push(cell);
      
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
    
    cells.push(row);
    maxRow = Math.max(maxRow, rowIndex);
  });

  return {
    cells,
    mergedCells: mergedCellsMap,
    maxRow,
    maxCol
  };
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
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