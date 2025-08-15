import React from 'react';

export interface FlaggedCsvComponentProps {
  className?: string;
}

const FlaggedCsvComponent: React.FC<FlaggedCsvComponentProps> = ({ className }) => {
  return (
    <div className={className}>
      this works
    </div>
  );
};

export default FlaggedCsvComponent;