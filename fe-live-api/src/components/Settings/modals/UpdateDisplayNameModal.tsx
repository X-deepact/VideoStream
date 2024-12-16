// src/components/Settings/modals/UpdateDisplayNameModal.tsx
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { useState } from "react";
  
  interface UpdateDisplayNameModalProps {
    currentDisplayName: string;
    open: boolean;
    onClose: () => void;
    onUpdate: (newDisplayName: string) => void;
  }
  
  const UpdateDisplayNameModal = ({
    currentDisplayName,
    open,
    onClose,
    onUpdate,
  }: UpdateDisplayNameModalProps) => {
    const [displayName, setDisplayName] = useState(currentDisplayName);
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
  
      if (displayName.trim().length < 3) {
        setError("Display name must be at least 3 characters long");
        return;
      }
  
      if (!password) {
        setError("Password is required");
        return;
      }
  
      setIsLoading(true);
  
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onUpdate(displayName);
        setPassword("");
        setError("");
        onClose();
      } catch (err) {
        setError("Failed to update display name. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update display name</AlertDialogTitle>
            <AlertDialogDescription>
              Change your display name by entering your new name and current
              password.
            </AlertDialogDescription>
          </AlertDialogHeader>
  
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
              {error}
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">DISPLAY NAME</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter new display name"
              />
            </div>
  
            <div className="space-y-2">
              <Label htmlFor="password">CURRENT PASSWORD</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
              />
            </div>
  
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default UpdateDisplayNameModal;