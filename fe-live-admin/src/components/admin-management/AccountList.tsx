import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { Plus, Slash } from "lucide-react";
import { DataTable } from "../ui/datatable";
import { createAccount, getAccountList } from "@/services/user.service";
import { Account, columns } from "@/components/admin-management/Columns.tsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AccountList = () => {
  const [userList, setUserList] = useState<Account[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [formData, setFormData] = useState({
    username: "",
    display_name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("username");
  const [sort, setSort] = useState("ASC");

  useEffect(() => {
    fetchData(currentPage, pageSize, sortBy, sort);
  }, [currentPage, pageSize, sortBy, sort]); // Fetch data on initial load

  const fetchData = async (
    page: number = 1,
    pageSize: number = 10,
    sort_by: string = "username",
    sort: string = "ASC"
  ) => {
    try {
      const response = await getAccountList(page, pageSize, sort_by, sort);
      const { data } = response.data;

      const transformedData = data.page.map((user: any) => ({
        id: user.id.toString(),
        username: user.username,
        display_name: user.display_name,
        email: user.email,
        role: user.role.type,
        created_at: user.created_at,
        updated_at: user.updated_at,
        creator: user.created_by ? user.created_by.username : "Unknown",
      }));

      setUserList(transformedData);
      setCurrentPage(data.current_page);
      setTotalPages(Math.ceil(data.total_items / data.page_size));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSortChange = (columnId: string) => {
    const isAsc = sortBy === columnId && sort === "ASC";
    setSort(isAsc ? "DESC" : "ASC");
    setSortBy(columnId);
  };

  const handleAddAccount = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      await createAccount(formData);

      // Reset form and close dialog
      setFormData({
        username: "",
        display_name: "",
        email: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
      setOpen(false);
      // Refresh the data table
      fetchData();
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account. Please try again.");
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

      {/* Create Dialog */}
      <div className="flex justify-between items-center py-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Account</DialogTitle>
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
                <Label
                  htmlFor="confirmpassword"
                  className="text-right w-max col-span-1"
                >
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
              <Button onClick={handleAddAccount} type="submit">
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={userList}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default AccountList;
