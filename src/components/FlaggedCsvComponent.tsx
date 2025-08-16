import React, { useMemo } from 'react';
import { parseFlaggedCsv } from '../utils/flaggedCsvParser';
import type { ParsedCell, MergedCell } from '../utils/flaggedCsvParser';

export interface FlaggedCsvComponentProps {
  csvData: string;
  className?: string;
  showCellLocations?: boolean;
  highlightCells?: string[];
}

const FlaggedCsvComponent: React.FC<FlaggedCsvComponentProps> = ({ 
  csvData, 
  className = '',
  showCellLocations = false,
  highlightCells = [] 
}) => {
  const parsedData = useMemo(() => parseFlaggedCsv(csvData), [csvData]);
  
  const highlightSet = useMemo(() => 
    new Set(highlightCells.map(cell => cell.toUpperCase())), 
    [highlightCells]
  );
  
  const isCellMerged = (rowIndex: number, colIndex: number): MergedCell | null => {
    for (const [, mergedCell] of parsedData.mergedCells) {
      if (rowIndex >= mergedCell.startRow && 
          rowIndex <= mergedCell.endRow && 
          colIndex >= mergedCell.startCol && 
          colIndex <= mergedCell.endCol) {
        return mergedCell;
      }
    }
    return null;
  };
  
  const shouldRenderCell = (rowIndex: number, colIndex: number): boolean => {
    const mergedCell = isCellMerged(rowIndex, colIndex);
    if (!mergedCell) return true;
    return rowIndex === mergedCell.startRow && colIndex === mergedCell.startCol;
  };
  
  const getCellSpan = (rowIndex: number, colIndex: number): { rowSpan: number; colSpan: number } => {
    const mergedCell = isCellMerged(rowIndex, colIndex);
    if (!mergedCell) return { rowSpan: 1, colSpan: 1 };
    
    return {
      rowSpan: mergedCell.endRow - mergedCell.startRow + 1,
      colSpan: mergedCell.endCol - mergedCell.startCol + 1
    };
  };
  
  const isCellHighlighted = (cell: ParsedCell, mergedCell: MergedCell | null): boolean => {
    if (highlightSet.size === 0) return false;
    
    if (mergedCell) {
      for (let row = mergedCell.startRow; row <= mergedCell.endRow; row++) {
        for (let col = mergedCell.startCol; col <= mergedCell.endCol; col++) {
          const cellData = parsedData.cells[row]?.[col];
          if (cellData?.flags.location && highlightSet.has(cellData.flags.location.toUpperCase())) {
            return true;
          }
        }
      }
      return false;
    }
    
    return cell.flags.location ? highlightSet.has(cell.flags.location.toUpperCase()) : false;
  };
  
  const getCellStyle = (cell: ParsedCell, isHighlighted: boolean, hasHighlights: boolean): React.CSSProperties => {
    const style: React.CSSProperties = {};
    
    if (cell.flags.color) {
      style.backgroundColor = cell.flags.color;
    }
    
    if (hasHighlights) {
      if (!isHighlighted) {
        style.opacity = '0.3';
        style.filter = 'brightness(0.5)';
      } else {
        style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.8)';
        style.position = 'relative';
        style.zIndex = 10;
      }
    }
    
    return style;
  };
  
  const getCellContent = (cell: ParsedCell, mergedCell: MergedCell | null) => {
    const displayValue = mergedCell ? mergedCell.value : cell.value;
    
    return (
      <>
        {displayValue}
        {showCellLocations && cell.flags.location && (
          <span className="text-xs text-gray-500 ml-1">
            [{cell.flags.location}]
          </span>
        )}
      </>
    );
  };

  if (!csvData || parsedData.cells.length === 0) {
    return (
      <div className={`p-4 text-gray-500 ${className}`}>
        No data to display
      </div>
    );
  }

  return (
    <div className={`overflow-auto ${className}`}>
      <table className="min-w-full border-collapse border border-gray-300">
        <tbody>
          {parsedData.cells.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => {
                if (!shouldRenderCell(rowIndex, colIndex)) {
                  return null;
                }
                
                const mergedCell = isCellMerged(rowIndex, colIndex);
                const { rowSpan, colSpan } = getCellSpan(rowIndex, colIndex);
                const isHighlighted = isCellHighlighted(cell, mergedCell);
                const hasHighlights = highlightSet.size > 0;
                
                let cellStyle: React.CSSProperties = getCellStyle(cell, isHighlighted, hasHighlights);
                if (mergedCell && mergedCell.color && !hasHighlights) {
                  cellStyle.backgroundColor = mergedCell.color;
                } else if (mergedCell && mergedCell.color && hasHighlights) {
                  if (!cellStyle.backgroundColor) {
                    cellStyle.backgroundColor = mergedCell.color;
                  }
                }
                
                const isHeader = rowIndex === 0;
                const Tag = isHeader ? 'th' : 'td';
                
                return (
                  <Tag
                    key={colIndex}
                    rowSpan={rowSpan > 1 ? rowSpan : undefined}
                    colSpan={colSpan > 1 ? colSpan : undefined}
                    className={`border border-gray-300 px-3 py-2 text-sm transition-all duration-300 ${
                      isHeader ? 'font-semibold bg-gray-50' : ''
                    } ${cell.value ? '' : 'empty-cell'}`}
                    style={cellStyle}
                  >
                    {getCellContent(cell, mergedCell)}
                  </Tag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlaggedCsvComponent;