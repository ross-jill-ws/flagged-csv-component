import React, { useMemo, useRef, useEffect } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const parsedData = useMemo(() => parseFlaggedCsv(csvData), [csvData]);
  
  const highlightSet = useMemo(() => 
    new Set(highlightCells.map(cell => cell.toUpperCase())), 
    [highlightCells]
  );
  
  const getExcelRowNumber = (row: ParsedCell[]): number | null => {
    // Find any cell in this row that has a location flag
    for (const cell of row) {
      if (cell.flags.location) {
        // Extract row number from location like "B5" -> 5
        const match = cell.flags.location.match(/[A-Z]+(\d+)/);
        if (match) {
          return parseInt(match[1], 10);
        }
      }
    }
    return null;
  };
  
  const columnNumberToLetter = (num: number): string => {
    let result = '';
    while (num > 0) {
      num--;
      result = String.fromCharCode('A'.charCodeAt(0) + (num % 26)) + result;
      num = Math.floor(num / 26);
    }
    return result;
  };
  
  const isFirstRowHeader = useMemo(() => {
    if (parsedData.cells.length === 0) return false;
    
    const firstRow = parsedData.cells[0];
    // Check if the first row has meaningful text content (indicating it's headers)
    const hasTextContent = firstRow.some(cell => 
      cell.value && 
      cell.value.trim().length > 0 && 
      isNaN(Number(cell.value.trim()))
    );
    
    // Check if subsequent rows have different structure (indicating first row is headers)
    const secondRowExists = parsedData.cells.length > 1;
    if (!secondRowExists) return hasTextContent;
    
    return hasTextContent;
  }, [parsedData]);
  
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
        style.opacity = '0.2';
        style.filter = 'brightness(0.3)';
      } else {
        style.border = '3px solid #3B82F6';
        style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.9), inset 0 0 10px rgba(59, 130, 246, 0.3)';
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
  
  useEffect(() => {
    if (highlightCells.length > 0 && containerRef.current) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        const container = containerRef.current;
        if (!container) return;
        
        // Only focus on the first highlighted cell
        const firstHighlight = highlightCells[0].toUpperCase();
        const highlightedCell = container.querySelector(`[data-location="${firstHighlight}"]`) as HTMLElement;
        
        if (highlightedCell) {
          // Get the actual rendered cell without the highlight styles affecting position
          // Use the parent TR to get accurate positioning
          const parentRow = highlightedCell.closest('tr') as HTMLElement;
          const table = container.querySelector('table') as HTMLElement;
          
          if (!parentRow || !table) return;
          
          // Step 2: Get cell position using getBoundingClientRect for accuracy
          const tableRect = table.getBoundingClientRect();
          const cellRect = highlightedCell.getBoundingClientRect();
          
          // Calculate actual position relative to the table (which is scrollable content)
          const cellLeft = cellRect.left - tableRect.left;
          const cellTop = cellRect.top - tableRect.top;
          const cellWidth = cellRect.width;
          const cellHeight = cellRect.height;
          
          // Get container viewport dimensions
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          
          // Step 3: Calculate scroll position to center the entire cell
          // We want the center of the cell to be at the center of the viewport
          const scrollLeft = cellLeft + (cellWidth / 2) - (containerWidth / 2);
          const scrollTop = cellTop + (cellHeight / 2) - (containerHeight / 2);
          
          // Apply scroll with bounds checking
          container.scrollTo({
            left: Math.max(0, scrollLeft),
            top: Math.max(0, scrollTop),
            behavior: 'smooth'
          });
          
          // For debugging - log positions
          console.log('Auto-scroll debug:', {
            cellLocation: firstHighlight,
            cellPosition: { left: cellLeft, top: cellTop },
            cellSize: { width: cellWidth, height: cellHeight },
            containerViewport: { width: containerWidth, height: containerHeight },
            finalScroll: { left: Math.max(0, scrollLeft), top: Math.max(0, scrollTop) }
          });
        }
      }, 100);
    }
  }, [highlightCells]);

  if (!csvData || parsedData.cells.length === 0) {
    return (
      <div className={`p-4 text-gray-500 ${className}`}>
        No data to display
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`overflow-auto ${className}`} style={{ maxHeight: '600px' }} id="csv-container">
      <table className="min-w-full border-collapse border border-gray-300">
        {/* Column headers - only show if first row is not already headers */}
        {!isFirstRowHeader && (
          <thead>
            <tr>
              {/* Empty top-left cell */}
              <th className="border border-gray-300 px-2 py-2 text-xs font-medium bg-gray-100 text-gray-600 min-w-[40px] sticky left-0 top-0 z-30"></th>
              {parsedData.cells[0]?.map((_, colIndex) => (
                <th key={colIndex} className="border border-gray-300 px-3 py-2 text-xs font-medium bg-gray-100 text-gray-600 sticky top-0 z-20 min-w-[80px]">
                  {columnNumberToLetter(colIndex + 1)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {parsedData.cells.map((row, rowIndex) => {
            const excelRowNumber = getExcelRowNumber(row);
            const isDataHeader = rowIndex === 0 && isFirstRowHeader;
            
            return (
              <tr key={rowIndex}>
                {/* Row header - empty for first row only if it's data headers */}
                <th className="border border-gray-300 px-2 py-2 text-xs font-medium bg-gray-100 text-gray-600 min-w-[40px] sticky left-0 z-20">
                  {isDataHeader ? '' : (excelRowNumber || rowIndex + 1)}
                </th>
                
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
                
                const isCellInHeaderRow = rowIndex === 0 && isFirstRowHeader;
                const Tag = isCellInHeaderRow ? 'th' : 'td';
                
                return (
                  <Tag
                    key={colIndex}
                    data-location={cell.flags.location?.toUpperCase()}
                    rowSpan={rowSpan > 1 ? rowSpan : undefined}
                    colSpan={colSpan > 1 ? colSpan : undefined}
                    className={`${hasHighlights && isHighlighted ? '' : 'border border-gray-300'} px-3 py-2 text-sm transition-all duration-300 ${
                      isCellInHeaderRow ? 'font-semibold bg-gray-50' : ''
                    } ${cell.value ? '' : 'empty-cell'}`}
                    style={cellStyle}
                  >
                    {getCellContent(cell, mergedCell)}
                  </Tag>
                );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FlaggedCsvComponent;