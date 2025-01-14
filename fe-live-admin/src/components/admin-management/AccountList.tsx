import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Plus, Slash, Trash2, ArrowUpDown, KeyRound } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  changePassword,
  createAccount,
  deleteAccount,
  getAccountList,
} from "@/services/user.service";
import { formatDate } from "@/lib/date-formated";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import ImageWithAuth from "../ui/imagewithauth";
import avatar from "@/assets/avatar.svg";

const AccountList = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteaccountid, setDeleteAccountID] = useState("");
  const [accountData, setAccountData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort_by, setSort_by] = useState("username");
  const [sort, setSort] = useState("ASC");
  const [keyword, setKeyword] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    avatar: null,
    username: "",
    display_name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [pageSize, currentPage, sort, sort_by, keyword]);

  const fetchData = async () => {
    const response = await getAccountList(
      currentPage,
      pageSize,
      sort_by,
      sort,
      keyword
    );
    setAccountData(response.page);
    setCurrentPage(response.current_page);
    setTotalPages(response.length);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleAddAccount = async () => {
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
    await createAccount(formData);
    setFormData({
      id: "",
      avatar: null,
      username: "",
      display_name: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    });
    setIsCreateOpen(false);
    fetchData();
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
      await changePassword(formData.id, formData);
      setFormData({
        id: "",
        avatar: null,
        username: "",
        display_name: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
      setIsEditOpen(false);
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
    <div className="px-8">
      <div className="py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Account List Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex py-4 w-full justify-between">
        <div>
          <Button
            variant="outline"
            onClick={() => {
              setIsCreateOpen(true);
            }}
          >
            <Plus />
            Add Account
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSort_by("username");
                    sort == "ASC" ? setSort("DESC") : setSort("ASC");
                  }}
                >
                  User Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSort_by("display_name");
                    sort == "ASC" ? setSort("DESC") : setSort("ASC");
                  }}
                >
                  Display Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSort_by("email");
                    sort == "ASC" ? setSort("DESC") : setSort("ASC");
                  }}
                >
                  Email
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                <Label>Role</Label>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSort_by("created_at");
                    sort == "ASC" ? setSort("DESC") : setSort("ASC");
                  }}
                >
                  Created At
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                <Label>Creator</Label>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSort_by("updated_at");
                    sort == "ASC" ? setSort("DESC") : setSort("ASC");
                  }}
                >
                  Updated At
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                <Label>Actions</Label>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountData && accountData.length > 0 ? (
              accountData.map((account: any) => (
                <TableRow key={account.id}>
                  <TableCell className="flex justify-center">
                    {account.avatar_file_name ? (
                      <ImageWithAuth
                        url={account.avatar_file_name}
                        className="h-12 w-12 rounded-full"
                      />
                    ) : (
                      <img src={avatar} className="h-12 w-12 rounded-full" />
                    )}
                  </TableCell>
                  <TableCell>{account.username}</TableCell>
                  <TableCell>{account.display_name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.role.type}</TableCell>
                  <TableCell>{formatDate(account.created_at, true)}</TableCell>
                  <TableCell>{account.created_by?.username || ""}</TableCell>
                  <TableCell>{formatDate(account.updated_at, true)}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditOpen(true);
                          setFormData(account);
                        }}
                      >
                        <KeyRound />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setIsDeleteOpen(true);
                          setDeleteAccountID(account.id);
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No account list available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="grid my-4 gap-4 grid-cols-2">
        <div className="max-w-[80px]">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue defaultValue="5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row justify-end items-center space-x-2">
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
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
          </DialogHeader>
          <span>Do you want to delete this account?</span>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={async () => {
                if (deleteaccountid == "") {
                  toast({
                    description: "Failed to delete account. Please try again.",
                    variant: "destructive",
                  });
                  return;
                }
                try {
                  await deleteAccount(deleteaccountid);
                  fetchData();
                  toast({
                    description: "Account deleted successfully!",
                    variant: "default",
                  });
                  setIsDeleteOpen(false);
                  setDeleteAccountID("");
                } catch (error) {
                  toast({
                    description: "Failed to delete account. Please try again.",
                    variant: "destructive",
                  });
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {formData.avatar && (
              <div className="flex items-center justify-center">
                <img
                  src={
                    formData.avatar
                      ? URL.createObjectURL(formData.avatar)
                      : undefined
                  }
                  className="h-36 w-36 object-cover rounded-full"
                />
              </div>
            )}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="avatar" className="text-right">
                Avatar
              </Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={(e: any) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, avatar: file });
                  }
                }}
                className="col-span-2"
              />
            </div>
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
            <Button onClick={handleAddAccount} type="submit">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription></DialogDescription>
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
  );
};

export default AccountList;
