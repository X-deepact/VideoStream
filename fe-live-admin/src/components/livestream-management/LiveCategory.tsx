import { Plus, Slash } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { formatDate, getTimeAgo } from "@/lib/date-formated";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { addCategory, getCategories } from "@/services/category.service";
import { Badge } from "../ui/badge";

const LiveCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formdata, setFormdata] = useState("");
  const header = [
    { label: "Name", position: "text-left" },
    { label: "Creator", position: "text-left" },
    { label: "Created At", position: "text-left" },
    { label: "Updater", position: "text-left" },
    { label: "Updated At", position: "text-left" },
  ];
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      toast({
        description: "Failed to fetch category data.",
        variant: "destructive",
      });
    }
  };
  const handleAddCategory = async () => {
    try {
      await addCategory(formdata);
      setIsAddOpen(false);
      fetchData();
      toast({
        description: "Category added successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        description: "Failed to add category.",
        variant: "destructive",
      });
    }
  };
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Category List Page</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddOpen(true);
              }}
            >
              <Plus />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  onChange={(e) => setFormdata(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
              <Button variant="outline" onClick={handleAddCategory}>
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {header.map((cell: any) => (
                <TableCell className={cell.position}>
                  <Label>{cell.label}</Label>
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories && categories.length > 0 ? (
              categories.map((category: any) => (
                <TableRow key={category?.id}>
                  <TableCell className="text-left">
                    <Badge
                      className="rounded-full"
                      style={{
                        backgroundColor: getRandomColor(),
                      }}
                    >
                      <Label className="text-base">{category?.name}</Label>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <div>
                      <Label>@{category?.created_by_user?.username}</Label>
                      <p className="text-xs text-muted-foreground">
                        {category?.created_by_user?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <p>{formatDate(category?.created_at, true)}</p>
                    <p className="text-xs text-muted-foreground">
                      {getTimeAgo(category?.created_at)}
                    </p>
                  </TableCell>
                  <TableCell className="text-left">
                    <div>
                      <Label>@{category?.updated_by_user?.username}</Label>
                      <p className="text-xs text-muted-foreground">
                        {category?.updated_by_user?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-left">
                    <p>{formatDate(category?.updated_at, true)}</p>
                    <p className="text-xs text-muted-foreground">
                      {getTimeAgo(category?.updated_at)}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No category found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LiveCategory;
