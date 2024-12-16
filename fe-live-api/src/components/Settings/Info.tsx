import { useState } from "react";
import UpdateUsernameModal from "./modals/UpdateUsernameModal";
import UpdateAvatarModal from "./modals/UpdateAvatarModal";
import UpdateDisplayNameModal from "./modals/UpdateDisplayNameModal";
import { Button } from "../ui/button";
import UpdateEmailModal from "./modals/UpdateEmailModal";

interface UserInfo {
  displayName: string;
  username: string;
  email: string;
}

const Info = () => {
  const [activeModal, setActiveModal] = useState<
    "avatar" | "displayName" | "username" | "email" | null
  >(null);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    displayName: "000",
    username: "j_154298",
    email: "********@gmail.com",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [emailIsOpen, setEmailIsOpen] = useState(false);
  const currentDisplayName = userInfo.displayName; // This would come from your user data

  const handleUpdateDisplayName = (newName: string) => {
    // Handle the display name update logic here
    setUserInfo((prev) => ({ ...prev, displayName: newName }));
    handleCloseModal();
    console.log("Updating display name to:", newName);
    setIsOpen(false);
  };

  const handleUpdateEmail = (newEmail: string) => {
    setUserInfo((prev) => ({ ...prev, email: newEmail }));
    setEmailIsOpen(false);
  };

  const handleCloseModal = () => setActiveModal(null);
  const handleAvatarUpdate = (file: File) => {
    console.log("Uploading file:", file);
    handleCloseModal();
  };

  return (
    <div className=" max-w-5xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-foreground mb-8 border-b border-gray-700 pb-4">
        Profile Settings
      </h2>

      <div className="bg-muted-600/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-8">
        {/* Avatar Section */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://github.com/shadcn.png"
                alt="User Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="absolute -bottom-2 -righ  t-2">
                <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={() => setActiveModal("avatar")}
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-muted-foreground text-sm uppercase">
                Profile Picture
              </label>
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={() => setActiveModal("avatar")}
                  className="px-4 py-2 text-white rounded-lg"
                >
                  Update
                </Button>

                <button className="px-4 py-2 text-muted-foreground rounded-lg hover:text-red-400 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Display Name */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <label className="block text-muted-foreground text-sm uppercase">
              Display Name
            </label>
            <div className="text-foreground">{userInfo.displayName}</div>
          </div>
          <div>
            <Button onClick={() => setIsOpen(true)}>Edit</Button>

            <UpdateDisplayNameModal
              currentDisplayName={currentDisplayName}
              open={isOpen}
              onClose={() => setIsOpen(false)}
              onUpdate={handleUpdateDisplayName}
            />
          </div>
        </div>

        {/* Username */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <label className="block text-muted-foreground text-sm uppercase">
              Username
            </label>
            <div className="text-foreground">{userInfo.username}</div>
          </div>
          <Button onClick={() => setActiveModal("username")}>Edit</Button>
        </div>

        {/* Email */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <label className="block text-muted-foreground text-sm uppercase">
              Email
            </label>
            <div className="flex items-center gap-2">
              <div className="text-foreground">{userInfo.email}</div>
              <button className="text-blue-400 text-sm hover:underline">
                Reveal
              </button>
            </div>
          </div>
          <div>
            <Button onClick={() => setEmailIsOpen(true)}>Edit</Button>

            <UpdateEmailModal
              currentEmail={userInfo.email}
              open={emailIsOpen}
              onClose={() => setEmailIsOpen(false)}
              onUpdate={handleUpdateEmail}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === "username" && (
        <UpdateUsernameModal
          currentUsername={userInfo.username}
          open={activeModal === "username"}
          onClose={handleCloseModal}
          onUpdate={(newUsername) => {
            setUserInfo((prev) => ({ ...prev, username: newUsername }));
            handleCloseModal();
          }}
        />
      )}

      {activeModal === "avatar" && (
        <UpdateAvatarModal
          onClose={handleCloseModal}
          onUpdate={handleAvatarUpdate}
        />
      )}
    </div>
  );
};

export default Info;
