import { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// Mock profile data
const initialProfileData = {
  username: "SuperAdmin",
  displayname: "SuperAdmin",
  email: "SuperAdmin@live.com",
  role: "SuperAdmin",
  avatarUrl:
    "https://img.freepik.com/free-psd/3d-illustration-person-with-punk-hair-jacket_23-2149436198.jpg?semt=ais_hybrid",
};

const Profile = () => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="w-full p-4 space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <Card className="flex flex-col space-y-4 p-4 col-span-1">
          <Label className="text-left text-lg">My Info</Label>
          <div className="flex flex-col space-y-4 items-center">
            <img
              src={profileData.avatarUrl}
              alt="Avatar"
              className="w-32 h-32 rounded-full"
            />
            <div className="flex flex-col items-start space-y-4">
              <Label className="text-sm">
                Username: {profileData.username}
              </Label>
              <Label className="text-sm">
                Display Name: {profileData.displayname}
              </Label>
              <Label className="text-sm">Email: {profileData.email}</Label>
              <Label className="text-sm">Role: {profileData.role}</Label>
            </div>
            <div className="flex justify-between w-full">
              <div></div>
              <Button variant="outline" onClick={handleEditToggle}>
                Edit
              </Button>
            </div>
          </div>
        </Card>
        <Card className="flex flex-col p-4 col-span-4">
          <Label className="text-left text-lg">History</Label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>At</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
            {/* <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableFooter> */}
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
