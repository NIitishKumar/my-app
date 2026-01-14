/**
 * ProfilePictureUpload Component
 * Reusable component for uploading profile pictures with preview
 */

import { useState, useRef, type ChangeEvent } from 'react';
import { ProfileAvatar } from './ProfileAvatar';

interface ProfilePictureUploadProps {
  currentAvatar?: string | null;
  name?: string;
  firstName?: string;
  lastName?: string;
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  error?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  className?: string;
}

const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const ProfilePictureUpload = ({
  currentAvatar,
  name,
  firstName,
  lastName,
  onFileSelect,
  isLoading = false,
  error,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  className = '',
}: ProfilePictureUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call parent handler
    onFileSelect(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayImage = preview || currentAvatar;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`relative ${dragActive ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div
          className="relative cursor-pointer group"
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
          aria-label="Upload profile picture"
        >
          <ProfileAvatar
            src={displayImage}
            name={name}
            firstName={firstName}
            lastName={lastName}
            size="xl"
            onClick={handleClick}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-200">
            <div className="opacity-0 group-hover:opacity-100 text-white text-center">
              <i className="fas fa-camera text-2xl mb-1"></i>
              <p className="text-xs">Change Photo</p>
            </div>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* File input (hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleInputChange}
          className="hidden"
          disabled={isLoading}
          aria-label="Profile picture file input"
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* File requirements hint */}
      <p className="mt-2 text-xs text-gray-500 text-center">
        Max {maxSizeMB}MB. Supported: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}
      </p>
    </div>
  );
};

