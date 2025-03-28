
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, User, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppwriteService } from '@/services/appwrite';

interface ProfilePictureUploadProps {
  currentUrl?: string;
  username: string;
  onUploadSuccess?: (url: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentUrl,
  username,
  onUploadSuccess
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image size should be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    
    setIsUploading(true);
    
    try {
      // In a real app, this would use Appwrite Storage to upload the image
      // For demo purposes, we'll just simulate success after a delay
      setTimeout(() => {
        const mockUrl = previewUrl || '';
        
        if (onUploadSuccess) {
          onUploadSuccess(mockUrl);
        }
        
        toast({
          title: "Upload successful",
          description: "Your profile picture has been updated",
        });
        
        setIsUploading(false);
      }, 1500);
      
      // Example of how this would work with Appwrite:
      /*
      const fileId = ID.unique();
      const file = await storage.createFile(
        'profile-pictures', // bucket ID
        fileId,
        image
      );
      
      const fileUrl = storage.getFileView('profile-pictures', fileId);
      
      if (onUploadSuccess) {
        onUploadSuccess(fileUrl);
      }
      */
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="border-dashed border-2">
      <CardContent className="pt-6 flex flex-col items-center">
        <div className="relative group">
          <Avatar className="h-24 w-24 mb-4">
            {previewUrl ? (
              <AvatarImage src={previewUrl} alt={username} />
            ) : (
              <AvatarFallback className="bg-edu-purple-200">
                {getInitials(username)}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleButtonClick}
          >
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        <div className="flex flex-col items-center gap-2 w-full">
          {!previewUrl ? (
            <Button
              onClick={handleButtonClick}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Photo</span>
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              <Button
                onClick={handleUpload}
                className="flex-1 bg-edu-purple-400 hover:bg-edu-purple-500 flex items-center justify-center gap-2"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Save Photo'}
              </Button>
              <Button
                onClick={handleClearImage}
                variant="outline"
                className="flex items-center justify-center"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Upload a square image (JPG or PNG)<br />
          Maximum size: 5MB
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureUpload;
