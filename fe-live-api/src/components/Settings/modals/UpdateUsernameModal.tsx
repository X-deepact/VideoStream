// src/components/Settings/modals/UpdateUsernameModal.tsx
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
  
  interface UpdateUsernameModalProps {
    currentUsername: string;
    open: boolean;
    onClose: () => void;
    onUpdate: (newUsername: string) => void;
  }
  
  const UpdateUsernameModal = ({
    currentUsername,
    open,
    onClose,
    onUpdate,
  }: UpdateUsernameModalProps) => {
    const [username, setUsername] = useState(currentUsername);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
  
      if (!username.trim()) {
        setError("Username cannot be empty");
        return;
      }
  
      if (!password) {
        setError("Password is required");
        return;
      }
  
      setIsLoading(true);
  
      try {
        // Replace this with your actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onUpdate(username);
        // Reset form
        setPassword("");
        setError("");
      } catch (err) {
        setError("Failed to update username. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change your username</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new username and your existing password.
            </AlertDialogDescription>
          </AlertDialogHeader>
  
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm">
              {error}
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">USERNAME</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter new username"
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
  
  export default UpdateUsernameModal;