import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ArrowUpDown, Edit, KeyRound } from "lucide-react";
import { formatDate } from "@/lib/date-formated";
import {
  changePassword,
  getAccountLog,
  updateAccount,
} from "@/services/user.service";
import { toast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Avatar from "@/assets/avatar.svg";

const Profile = () => {
  const profileData = JSON.parse(localStorage.getItem("user") || ({} as any));

  const [formData, setFormData] = useState({
    id: "",
    username: "",
    display_name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [isResetPass, setIsResetPass] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sort_by, setSort_by] = useState("performed_at");
  const [sort, setSort] = useState("ASC");
  const [logData, setLogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [sort, sort_by, currentPage, pageSize]);

  const fetchData = async () => {
    try {
      const response = await getAccountLog(
        currentPage,
        pageSize,
        sort_by,
        sort,
        profileData.username,
        "username"
      );
      setLogData(response.data.data.page);
      setCurrentPage(response.data.data.current_page);
      setTotalPages(response.data.data.length);
    } catch (error) {
      toast({
        description: "Failed to fetch account log data.",
        variant: "destructive",
      });
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleEditInfo = async () => {
    const res = await updateAccount(profileData.id, formData);
    setFormData({
      id: "",
      username: "",
      display_name: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    });
    setIsEditing(false);
    fetchData();
    const user = {
      ...res,
      token: profileData.token,
    };
    localStorage.setItem("user", JSON.stringify(user));
  };
  const handelChangePassword = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        toast({
          description: "Passwords do not match!",
          variant: "destructive",
        });
        return;
      }
      if (formData.password.length < 8) {
        toast({
          description: "Password must be at least 8 characters long!",
          variant: "destructive",
        });
        return;
      }
      await changePassword(profileData.id, formData);
      setFormData({
        id: "",
        username: "",
        display_name: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
      setIsResetPass(false);
      fetchData();
      toast({
        description: "Changed password successfully!",
      });
    } catch (error) {
      toast({
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="w-full p-4 space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <Card className="flex flex-col space-y-4 p-4 col-span-1">
          <Label className="text-left text-lg">My Info</Label>
          <div className="flex flex-col space-y-4 items-center">
            <img
              src={profileData.avatar ? profileData.avatar : Avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full"
            />
            <div className="flex flex-col items-start space-y-4">
              <Label className="text-sm">
                Username: {profileData.username}
              </Label>
              <Label className="text-sm">
                Display Name: {profileData.display_name}
              </Label>
              <Label className="text-sm">Email: {profileData.email}</Label>
              <Label className="text-sm">Role: {profileData.role}</Label>
            </div>
            <div className="flex justify-end gap-2 w-full">
              {profileData.role == "super_admin" ? null : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(true);
                    setFormData(profileData);
                  }}
                >
                  <Edit />
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsResetPass(true)}>
                <KeyRound />
              </Button>
              <Dialog open={isResetPass} onOpenChange={setIsResetPass}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="col-span-2"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="confirmpassword" className="text-right">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="col-span-2"
                      />
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                    <Button variant="outline" onClick={handelChangePassword}>
                      Set
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>
        <Card className="flex flex-col p-4 col-span-4 gap-3">
          <Label className="text-left text-lg">History</Label>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="bg-transparent text-left"
                      onClick={() => {
                        setSort_by("performed_at");
                        sort == "ASC" ? setSort("DESC") : setSort("ASC");
                      }}
                    >
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-left">
                    <Label>Action</Label>
                  </TableCell>
                  <TableCell className="text-left">
                    <Label>Details</Label>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logData && logData.length > 0 ? (
                  logData.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {formatDate(log.performed_at, true)}
                      </TableCell>
                      <TableCell className="text-left">{log.action}</TableCell>
                      <TableCell className="text-left">{log.details}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No History available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="grid my-4 gap-4 grid-cols-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo;
              </Button>
              <Label>Page</Label>
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="max-w-[80px]"
              />
              <Label>of {totalPages}</Label>
              <Button
                variant="outline"
                className="px-4 py-2"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Info</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="display_name" className="text-right">
                Display Name
              </Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="streamer">Streamer</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="confirmpassword" className="text-right">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="col-span-2"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button onClick={handleEditInfo} type="submit">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
