import { useCallback, useMemo, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.tsx';
import { Slash } from 'lucide-react';
import {
  blockAccount,
  changePassword,
  createAccount,
  deleteAccount,
  reactivateAccount,
} from '@/services/user.service';
import useUsersList from '@/hooks/useUsersList';
import {
  BLOCKING_REASON_MAX,
  BLOCKING_REASON_MIN,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/lib/validation';
import { getAccountsListTableColumns } from './columns';
import {
  DataTable,
  TableSampleFilterType,
} from '@/components/common/DataTable';
import { UserResponse, USER_STATUS, UserMiniResponse } from '@/type/users';
import { toast } from '@/hooks/use-toast';
import { ROLE } from '@/type/role';
import DeleteAccount from './modals/DeleteAccount';
import CreateAccount, { _FormData } from './modals/CreateAccount';
import ResetPassword from './modals/ResetPassword';
import { NavLink } from 'react-router-dom';
import { APP_DASHBOARD_PATH } from '@/router';
import { useAdminsList } from '@/hooks/useAdminsList';
import BlockAccount from './modals/BlockAccount';
import ReactivateAccount from './modals/ReactivateAccount';

const AccountList = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [keyword, setKeyword] = useState('');
  const [formData, setFormData] = useState<_FormData>({
    id: '',
    avatar: null,
    username: '',
    display_name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [blockingReason, setBlockingReason] = useState('');

  const { data: adminsList } = useAdminsList();
  const transformedOptions = transformUserMiniResponse(adminsList);

  const {
    data,
    totalItems,
    currentPage,
    pageLimit,
    isLoading,
    sortBy,
    sortOrder,
    filteredRole,
    filteredStatus,
    filteredCreatorUsername,
    refetchData,
    setCurrentPage,
    setPageLimit,
    setSortBy,
    setSortOrder,
    setFilteredRole,
    setFilteredStatus,
    setFilteredCreatorUsername,
  } = useUsersList({
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
    keyword,
  });

  const handleSearch = (_keyword: string): void => setKeyword(_keyword);

  const handleFilterByRole = (role: ROLE | string): void =>
    setFilteredRole(role);

  const handleFilterByStatus = (status: USER_STATUS | string): void =>
    setFilteredStatus(status);

  const handleFilterByCreator = (username: string): void =>
    setFilteredCreatorUsername(username);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePageLimitChange = (limit: number) => setPageLimit(limit);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // change password
  const handelChangePasswordClick = useCallback((account: UserResponse) => {
    setIsResetPasswordModalOpen(true);
    setFormData((prev) => {
      return { ...prev, id: account.id?.toString() };
    });
  }, []);
  const handelChangePassword = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        toast({
          description: 'Passwords do not match!',
          variant: 'destructive',
        });
        return;
      }
      if (formData.password.length < 8) {
        toast({
          description: 'Password must be at least 8 characters long!',
          variant: 'destructive',
        });
        return;
      }
      await changePassword(formData.id, formData);
      setFormData({
        id: '',
        avatar: null,
        username: '',
        display_name: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
      });
      setIsResetPasswordModalOpen(false);
      refetchData();
      toast({
        description: 'Changed password successfully!',
      });
    } catch {
      toast({
        description: 'Failed to change password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // delete account
  const handleDelete = useCallback((user: UserResponse) => {
    setIsDeleteModalOpen(true);
    setSelectedUser(user);
  }, []);
  const handleDeleteAccount = async () => {
    if (!selectedUser) {
      toast({
        description: 'Failed to delete account. Please try again.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await deleteAccount(selectedUser?.id?.toString());
      refetchData();
      toast({
        description: 'Account deleted successfully!',
        variant: 'default',
      });
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch {
      toast({
        description: 'Failed to delete account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // block account
  const handleBlock = useCallback((user: UserResponse) => {
    setIsBlockModalOpen(true);
    setSelectedUser(user);
  }, []);
  const handleBlockAccount = async () => {
    if (!selectedUser) {
      toast({
        description: 'Failed to block account. Please try again.',
        variant: 'destructive',
      });
      return;
    }
    try {
      if (
        blockingReason?.length < BLOCKING_REASON_MIN ||
        blockingReason?.length > BLOCKING_REASON_MAX
      ) {
        toast({
          description: 'Enter meaningful blocking reason.',
          variant: 'destructive',
        });
      } else {
        await blockAccount(selectedUser?.id?.toString(), blockingReason);
        refetchData();
        toast({
          description: 'Account blocked successfully!',
          variant: 'default',
        });
        setIsBlockModalOpen(false);
        setSelectedUser(null);
        setBlockingReason('');
      }
    } catch {
      toast({
        description: 'Failed to block account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // reactivate account
  const handleReactivate = useCallback((user: UserResponse) => {
    setIsReactivateModalOpen(true);
    setSelectedUser(user);
  }, []);
  const handleReactivateAccount = async () => {
    if (!selectedUser) {
      toast({
        description: 'Failed to reactivate account. Please try again.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await reactivateAccount(selectedUser?.id?.toString());
      refetchData();
      toast({
        description: 'Account reactivated successfully!',
        variant: 'default',
      });
      setIsReactivateModalOpen(false);
      setSelectedUser(null);
    } catch {
      toast({
        description: 'Failed to reactivate account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // create account
  const handleAddAccountClick = () => setIsCreateModalOpen(true);
  const handleAddAccount = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        description: 'Passwords do not match!',
        variant: 'destructive',
      });
      return;
    }
    if (formData.password.length < 8) {
      toast({
        description: 'Password must be at least 8 characters long!',
        variant: 'destructive',
      });
      return;
    }
    await createAccount(formData);
    setFormData({
      id: '',
      avatar: null,
      username: '',
      display_name: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
    });
    setIsCreateModalOpen(false);
    refetchData();
  };

  // table columns
  const columns = useMemo(() => {
    return getAccountsListTableColumns({
      onChangePassword: handelChangePasswordClick,
      onDelete: handleDelete,
      onBlock: handleBlock,
      onReactivate: handleReactivate,
      sort: {
        sortBy,
        sortOrder,
        setSortBy,
        setSortOrder,
      },
    });
  }, [
    handelChangePasswordClick,
    handleDelete,
    handleBlock,
    handleReactivate,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
  ]);

  return (
    <div className="px-8 pb-4">
      <div className="py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <NavLink to={APP_DASHBOARD_PATH}>Dashboard</NavLink>
              </BreadcrumbLink>
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
      <DataTable
        data={data}
        totalCount={totalItems}
        canToggleColumns={false}
        columns={columns}
        isLoading={isLoading}
        onRefresh={refetchData}
        actions={{
          search: {
            placeholder: 'Search...',
            value: keyword,
            onSearch: (_keyword: string): void => handleSearch(_keyword),
          },
          create: {
            label: 'New',
            isDisabled: isLoading,
            onClick: handleAddAccountClick,
          },
          sampleFilters: [
            {
              placeholder: filteredRole,
              description: 'Role —',
              selectedValue: filteredRole,
              options: ['All', ROLE.ADMIN, ROLE.STREAMER, ROLE.USER],
              handleFilter: (selectedOption: string): void =>
                handleFilterByRole(selectedOption),
            },
            {
              placeholder: filteredStatus,
              description: 'Status —',
              selectedValue: filteredStatus,
              options: ['All', ...Object.values(USER_STATUS)],
              handleFilter: (selectedOption: string): void =>
                handleFilterByStatus(selectedOption),
            },
            {
              type: TableSampleFilterType.DATA_COMBO,
              placeholder: 'Select',
              description: 'Creator —',
              selectedValue: filteredCreatorUsername,
              options: [{ label: 'All', value: 'All' }, ...transformedOptions],
              handleFilter: (selectedOption: string): void =>
                handleFilterByCreator(selectedOption),
            },
          ],
        }}
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
      />

      {isDeleteModalOpen && (
        <DeleteAccount
          isOpen={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onDelete={handleDeleteAccount}
        />
      )}

      {isBlockModalOpen && (
        <BlockAccount
          isOpen={isBlockModalOpen}
          setOpen={setIsBlockModalOpen}
          data={selectedUser}
          reason={blockingReason}
          setBlockingReason={setBlockingReason}
          onBlock={handleBlockAccount}
        />
      )}

      {isReactivateModalOpen && (
        <ReactivateAccount
          isOpen={isReactivateModalOpen}
          setOpen={setIsReactivateModalOpen}
          data={selectedUser}
          onReactivate={handleReactivateAccount}
        />
      )}

      {isCreateModalOpen && (
        <CreateAccount
          isOpen={isCreateModalOpen}
          setOpen={setIsCreateModalOpen}
          data={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
          onCreate={handleAddAccount}
        />
      )}

      {isResetPasswordModalOpen && (
        <ResetPassword
          isOpen={isResetPasswordModalOpen}
          setOpen={setIsResetPasswordModalOpen}
          data={formData}
          onInputChange={handleInputChange}
          onChangePassword={handelChangePassword}
        />
      )}
    </div>
  );
};

export default AccountList;

const transformUserMiniResponse = (
  data: UserMiniResponse[]
): { label: string; value: string }[] => {
  return data?.map((user) => ({
    label: `@${user.username}`,
    value: user.username,
  }));
};
