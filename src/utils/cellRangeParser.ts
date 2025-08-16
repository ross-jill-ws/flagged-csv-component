/**
 * Parses Excel-style cell references and ranges
 */

/**
 * Converts column letter(s) to column number (A=1, B=2, ..., Z=26, AA=27, etc.)
 */
function columnLetterToNumber(column: string): number {
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }
  return result;
}

/**
 * Converts column number to column letter(s) (1=A, 2=B, ..., 26=Z, 27=AA, etc.)
 */
function columnNumberToLetter(num: number): string {
  let result = '';
  while (num > 0) {
    num--;
    result = String.fromCharCode('A'.charCodeAt(0) + (num % 26)) + result;
    num = Math.floor(num / 26);
  }
  return result;
}

/**
 * Parses a cell reference like "A1" into {column: "A", row: 1}
 */
function parseCellReference(cell: string): { column: string; row: number } | null {
  const match = cell.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  
  return {
    column: match[1],
    row: parseInt(match[2], 10)
  };
}

/**
 * Expands a cell range like "A1-D1" or "A1-A10" into individual cell references
 */
function expandCellRange(range: string): string[] {
  const [start, end] = range.split('-');
  if (!start || !end) return [range]; // Not a valid range, return as-is
  
  const startCell = parseCellReference(start.trim());
  const endCell = parseCellReference(end.trim());
  
  if (!startCell || !endCell) return [range]; // Invalid cell references
  
  const startColNum = columnLetterToNumber(startCell.column);
  const endColNum = columnLetterToNumber(endCell.column);
  const startRow = startCell.row;
  const endRow = endCell.row;
  
  // Check if it's a valid range (same row or same column)
  const sameRow = startRow === endRow;
  const sameColumn = startColNum === endColNum;
  
  if (!sameRow && !sameColumn) {
    return [range]; // Not a valid range (not same row or column)
  }
  
  const cells: string[] = [];
  
  if (sameRow) {
    // Range across columns (e.g., A1-D1)
    const minCol = Math.min(startColNum, endColNum);
    const maxCol = Math.max(startColNum, endColNum);
    
    for (let col = minCol; col <= maxCol; col++) {
      cells.push(`${columnNumberToLetter(col)}${startRow}`);
    }
  } else if (sameColumn) {
    // Range across rows (e.g., A1-A10)
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    
    for (let row = minRow; row <= maxRow; row++) {
      cells.push(`${startCell.column}${row}`);
    }
  }
  
  return cells;
}

/**
 * Parses highlight input that can contain individual cells and ranges
 * Example: "A1-D1, F1, A5-A8" -> ["A1", "B1", "C1", "D1", "F1", "A5", "A6", "A7", "A8"]
 */
export function parseHighlightInput(input: string): string[] {
  const parts = input.split(',').map(part => part.trim()).filter(part => part.length > 0);
  const result: string[] = [];
  
  for (const part of parts) {
    if (part.includes('-')) {
      // It's a range
      result.push(...expandCellRange(part));
    } else {
      // It's a single cell
      result.push(part);
    }
  }
  
  return result;
}