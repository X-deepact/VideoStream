// src/components/Settings/modals/UpdateAvatarModal.tsx
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

interface UpdateAvatarModalProps {
  onClose: () => void;
  onUpdate: (file: File) => void;
}

const UpdateAvatarModal = ({ onClose, onUpdate }: UpdateAvatarModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpdate(selectedFile);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      style={{ marginTop: "0" }}
    >
      <div className="bg-background p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold mb-4">Update Profile Picture</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6">
            {previewUrl ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-40 h-40 rounded-full object-cover"
                  />
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="px-4 py-2 text-red-400 rounded-lg hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-blue-400 rounded-lg hover:text-blue-300 transition-colors"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex flex-col items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-muted-foreground">
                    Drag and drop your image here, or
                  </p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-white rounded-lg"
                >
                  Choose File
                </Button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground rounded-lg hover:text-white transition-colors"
            >
              Cancel
            </button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile}
              className="px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAvatarModal;
