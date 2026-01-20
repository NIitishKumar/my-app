/**
 * ExportButton Component
 * Export functionality wrapper
 */

import React, { useState } from 'react';
import { Button } from '../Button';
import toast from 'react-hot-toast';

interface ExportButtonProps {
  onExport: (format: 'excel' | 'csv' | 'pdf') => Promise<Blob>;
  fileName?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  fileName = 'attendance-report',
  variant = 'secondary',
  size = 'md',
  className = '',
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'pdf' | null>(null);

  const handleExport = async (format: 'excel' | 'csv' | 'pdf') => {
    try {
      setIsExporting(true);
      setExportFormat(format);
      
      const blob = await onExport(format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const extension = format === 'pdf' ? 'pdf' : format === 'excel' ? 'xlsx' : 'csv';
      link.download = `${fileName}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`${format.toUpperCase()} report exported successfully!`);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to export report');
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="flex gap-2">
        <Button
          variant={variant}
          size={size}
          isLoading={isExporting && exportFormat === 'excel'}
          onClick={() => handleExport('excel')}
          disabled={isExporting}
        >
          <i className="fas fa-file-excel mr-2"></i>
          Excel
        </Button>
        <Button
          variant={variant}
          size={size}
          isLoading={isExporting && exportFormat === 'csv'}
          onClick={() => handleExport('csv')}
          disabled={isExporting}
        >
          <i className="fas fa-file-csv mr-2"></i>
          CSV
        </Button>
        <Button
          variant={variant}
          size={size}
          isLoading={isExporting && exportFormat === 'pdf'}
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
        >
          <i className="fas fa-file-pdf mr-2"></i>
          PDF
        </Button>
      </div>
    </div>
  );
};

