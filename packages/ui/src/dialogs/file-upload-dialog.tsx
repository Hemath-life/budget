import { useState, useCallback } from 'react';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '#/components/ui/button';
import { DialogFooter } from '#/components/ui/dialog';
import { BaseDialog, type BaseDialogProps } from './base-dialog';

export interface FileUploadDialogProps extends Omit<BaseDialogProps, 'children'> {
  onUpload: (files: File[]) => void | Promise<void>;
  onCancel?: () => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  uploadText?: string;
  cancelText?: string;
  isLoading?: boolean;
  showPreview?: boolean;
}

interface FileWithPreview {
  file: File;
  preview: string;
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return Image;
  if (fileType.includes('text') || fileType.includes('document')) return FileText;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function FileUploadDialog({
  onUpload,
  onCancel,
  acceptedFileTypes,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  uploadText = 'Upload',
  cancelText = 'Cancel',
  isLoading = false,
  showPreview = true,
  onOpenChange,
  ...dialogProps
}: FileUploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    onCancel?.();
    setSelectedFiles([]);
    setError(null);
    onOpenChange(false);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      await onUpload(selectedFiles.map(f => f.file));
      setSelectedFiles([]);
      setError(null);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const validateFile = (file: File): string | null => {
    if (maxFileSize && file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)}`;
    }
    
    if (acceptedFileTypes && !acceptedFileTypes.some(type => 
      file.type.match(type.replace('*', '.*'))
    )) {
      return `File type not accepted. Accepted types: ${acceptedFileTypes.join(', ')}`;
    }
    
    return null;
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newFiles: FileWithPreview[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;
      
      if (selectedFiles.length + newFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        break;
      }
      
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        continue;
      }
      
      const preview = file.type.startsWith('image/') 
        ? URL.createObjectURL(file)
        : '';
        
      newFiles.push({ file, preview });
    }
    
    if (errors.length > 0) {
      setError(errors[0] || null);
      return;
    }
    
    setError(null);
    setSelectedFiles(prev => [...prev, ...newFiles]);
  }, [selectedFiles.length, maxFiles, maxFileSize, acceptedFileTypes]);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      if (removed?.preview && removed.file.type.startsWith('image/')) {
        URL.revokeObjectURL(removed.preview);
      }
      return newFiles;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <BaseDialog {...dialogProps} onOpenChange={onOpenChange}>
      <div className="space-y-4">
        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            dragOver ? 'border-primary bg-primary/10' : 'border-muted-foreground/25',
          )}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Drag and drop files here, or{' '}
              <label className="text-primary cursor-pointer hover:underline">
                browse
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  accept={acceptedFileTypes?.join(',')}
                />
              </label>
            </p>
            <p className="text-xs text-muted-foreground">
              Max {maxFiles} files, up to {formatFileSize(maxFileSize)} each
              {acceptedFileTypes && (
                <span className="block mt-1">
                  Accepted types: {acceptedFileTypes.join(', ')}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Selected files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Selected Files</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedFiles.map((fileWithPreview, index) => {
                const { file, preview } = fileWithPreview;
                const FileIcon = getFileIcon(file.type);
                
                return (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-3 p-2 bg-muted rounded-md"
                  >
                    {showPreview && preview ? (
                      <img
                        src={preview}
                        alt={file.name}
                        className="h-8 w-8 object-cover rounded"
                      />
                    ) : (
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isLoading || selectedFiles.length === 0}
          >
            {uploadText} {selectedFiles.length > 0 && `(${selectedFiles.length})`}
          </Button>
        </DialogFooter>
      </div>
    </BaseDialog>
  );
}
