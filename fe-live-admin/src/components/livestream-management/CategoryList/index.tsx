import { getCategoriesListTableColumns } from "./columns";
import {
  DataTable,
  TableSampleFilterType,
} from "@/components/common/DataTable";
import { useCategories } from "@/hooks/useCategories";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, SORT_ORDER } from "@/lib/validation";
import { useCallback, useMemo, useState } from "react";
import DeleteCategory from "./Modals/DeleteCategory";
import CreateCategory, { _FormData } from "./Modals/CreateCategory";
import UpdateCategory from "./Modals/UpdateCategory";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/services/category.service";
import { toast } from "@/hooks/use-toast";
import { useAdminsList } from "@/hooks/useAdminsList";
import { UserMiniResponse } from "@/type/users";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

const LiveCategory = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<_FormData>({
    id: "",
    name: "",
  });
  const {
    categories,
    isLoading,
    totalItems,
    currentPage,
    pageLimit,
    sortBy,
    sortOrder,
    filteredCreatorUsername,
    filteredName,
    refetchCategories,
    setCurrentPage,
    setPageLimit,
    setSortBy,
    setSortOrder,
    setFilteredCreatorUsername,
    setFilteredName,
  } = useCategories({
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
    sort_By: "name",
    sort: SORT_ORDER.ASC,
    name: "",
    created_by: "",
  });

  const handlePageLimitChange = (limit: number) => setPageLimit(limit);
  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleUpdateClick = useCallback((id: string, name: string) => {
    setIsUpdateModalOpen(true);
    setFormData({ id, name });
  }, []);
  const handleUpdateCategory = async () => {
    try {
      await updateCategory(formData);
      setFormData({ id: "", name: "" });
      setIsUpdateModalOpen(false);
      refetchCategories();
    } catch (e: any) {
      toast({
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = useCallback((id: string) => {
    setIsDeleteModalOpen(true);
    setFormData({ ...formData, id });
  }, []);
  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(formData);
      setFormData({ id: "", name: "" });
      setIsDeleteModalOpen(false);
      refetchCategories();
    } catch (e: any) {
      toast({
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateCategory = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);
  const handleCreateClick = async () => {
    try {
      await createCategory(formData);
      setFormData({ id: "", name: "" });
      setIsCreateModalOpen(false);
      refetchCategories();
    } catch (e: any) {
      toast({
        description: e.message,
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
  const transformUserMiniResponse = (
    data: UserMiniResponse[]
  ): { label: string; value: string }[] => {
    return data?.map((user) => ({
      label: `@${user.username}`,
      value: user.username,
    }));
  };
  const { data: adminsList } = useAdminsList();
  const transformedCreatorOptions = transformUserMiniResponse(adminsList);
  const handleFilterByCreator = (username: string): void =>
    setFilteredCreatorUsername(username);
  const handleFilterByName = (name: string): void => setFilteredName(name);
  const { categories: nameList } = useCategories({
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
    sort_By: "name",
    sort: SORT_ORDER.ASC,
    name: "",
    created_by: "",
  });
  const transformNameMiniResponse = (
    data: any
  ): { label: string; value: string }[] => {
    return data?.map((cat: any) => ({
      label: cat.label,
      value: cat.label,
    }));
  };
  const transformedNameOptions = transformNameMiniResponse(nameList);
  const columns = useMemo(() => {
    return getCategoriesListTableColumns({
      onUpdate: handleUpdateClick,
      onDelete: handleDeleteClick,
      sort: {
        sortBy,
        sortOrder,
        setSortBy,
        setSortOrder,
      },
    });
  }, [
    handleCreateCategory,
    handleUpdateClick,
    handleDeleteClick,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
  ]);
  return (
    <div className="px-8 pb-4">
      <Breadcrumb className="py-3">
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
      <DataTable
        data={categories}
        totalCount={totalItems}
        canToggleColumns={false}
        columns={columns}
        isLoading={isLoading}
        onRefresh={refetchCategories}
        pagination={{
          rowsPerPage: {
            value: pageLimit,
            onChange: (value: number) => handlePageLimitChange(value),
          },
          pages: {
            totalCount: totalItems,
            currentPage,
            limit: pageLimit,
            handlePageChange,
          },
        }}
        actions={{
          create: {
            label: "New",
            isDisabled: isLoading,
            onClick: handleCreateCategory,
          },
          sampleFilters: [
            {
              type: TableSampleFilterType.DATA_COMBO,
              placeholder: "Select",
              description: "Creator —",
              selectedValue: filteredCreatorUsername,
              options: [
                { label: "All", value: "All" },
                ...transformedCreatorOptions,
              ],
              handleFilter: (selectedOption: string): void =>
                handleFilterByCreator(selectedOption),
            },
            {
              type: TableSampleFilterType.DATA_COMBO,
              placeholder: "Select",
              description: "Name —",
              selectedValue: filteredName,
              options: [
                { label: "All", value: "All" },
                ...transformedNameOptions,
              ],
              handleFilter: (selectedOption: string): void =>
                handleFilterByName(selectedOption),
            },
          ],
        }}
      />

      {isDeleteModalOpen && (
        <DeleteCategory
          isOpen={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onDelete={handleDeleteCategory}
        />
      )}

      {isUpdateModalOpen && (
        <UpdateCategory
          isOpen={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
          data={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
          onUpdate={handleUpdateCategory}
        />
      )}
      {isCreateModalOpen && (
        <CreateCategory
          isOpen={isCreateModalOpen}
          setOpen={setIsCreateModalOpen}
          data={formData}
          onInputChange={handleInputChange}
          onCreate={handleCreateClick}
        />
      )}
    </div>
  );
};

export default LiveCategory;
