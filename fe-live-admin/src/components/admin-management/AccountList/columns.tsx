import AppAvatar from '@/components/common/AppAvatar';
import DataTableColumnHeader from '@/components/common/DataTableHeader';
import RoleBadge from '@/components/common/RoleBadge';
import { Button } from '@/components/ui/button';
import { formatDate, getTimeAgo } from '@/lib/date-formated';
import { ROLE } from '@/type/role';
import { USER_STATUS, UserResponse } from '@/type/users';
import { ColumnDef } from '@tanstack/react-table';
import {
  CircleSlash,
  KeyRound,
  MessageSquareMore,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { ColumnNames } from './columnData';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getCurrentUser } from '@/services/auth.service';
import { GeneralColumnsProps } from '@/type/columns.ts';

interface ColumnsProps extends GeneralColumnsProps {
  onChangePassword: (data: UserResponse) => void;
  onDelete: (data: UserResponse) => void;
  onBlock: (data: UserResponse) => void;
  onReactivate: (data: UserResponse) => void;
}

export const getAccountsListTableColumns = ({
  onChangePassword,
  onDelete,
  onBlock,
  onReactivate,
  sort,
}: ColumnsProps): ColumnDef<UserResponse>[] => [
  {
    accessorKey: 'user',
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.displayName.label}
        sort={{
          sortKey: ColumnNames.displayName.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }) => {
      const { avatar_file_name, role, display_name, status, blocked_reason } =
        row.original;
      return (
        <div className="flex items-center gap-2">
          <AppAvatar
            url={avatar_file_name}
            displayName={display_name}
            status={status}
            classes="w-9 h-9"
          />
          <div className="text-left">
            <p className="font-medium text-ellipsis" title={display_name}>
              {display_name}
            </p>
            <div className="flex gap-1 items-center">
              <RoleBadge
                role={role.type as unknown as ROLE}
                style="badge-soft"
              />
              {status === USER_STATUS.BLOCKED && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="p-1 py-0 h-6 rounded-sm border-none shadow-none hover:bg-red-100"
                    >
                      <MessageSquareMore size={16} className="text-red-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-auto max-w-80 text-xs border"
                  >
                    <h3 className="font-semibold mb-2 text-red-600">
                      Blocked Reason
                    </h3>
                    <p className="">
                      {blocked_reason?.trim() || 'No reason provided...'}
                    </p>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.username.label}
        sort={{
          sortKey: ColumnNames.username.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }) => {
      const { username, email } = row.original;
      return (
        <div>
          <p className="font-medium">@{username}</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'created_by',
    header: () => <DataTableColumnHeader title={ColumnNames.creator.label} />,
    cell: ({ row }) => {
      if (row?.original.created_by?.username)
        return (
          <div>
            <p className="font-medium">@{row?.original.created_by?.username}</p>
            <p className="text-muted-foreground text-xs">
              {row?.original?.created_by?.email}
              <p />
            </p>
          </div>
        );
      return <span className="italic text-muted-foreground">Self created</span>;
    },
  },
  {
    accessorKey: 'created_at',
    header: () => (
      <DataTableColumnHeader
        title={ColumnNames.createdAt.label}
        sort={{
          sortKey: ColumnNames.createdAt.sortKey,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          setSortBy: sort.setSortBy,
          setSortOrder: sort.setSortOrder,
        }}
      />
    ),
    cell: ({ row }) => {
      const { created_at } = row.original;
      return (
        <div>
          <p>{formatDate(created_at, true)}</p>
          <p className="text-xs text-muted-foreground">
            {getTimeAgo(created_at)}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'updated_by',
    header: () => <DataTableColumnHeader title={ColumnNames.updator.label} />,
    cell: ({ row }) => {
      if (row?.original.updated_by?.username)
        return (
          <div>
            <p className="font-medium">@{row?.original.updated_by?.username}</p>
            <p className="text-muted-foreground text-xs">
              {formatDate(row?.original.updated_at, true)}
              <p />
            </p>
          </div>
        );
      return <span className="text-muted-foreground">—</span>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;

      const currentUser = getCurrentUser();
      if (!currentUser && currentUser?.role) return;

      const {
        role: { type: objectRole },
      } = data;
      const subjectRole = currentUser.role;

      if (
        subjectRole === ROLE.SUPERADMIN ||
        (subjectRole === ROLE.ADMIN &&
          (objectRole === ROLE.STREAMER || objectRole === ROLE.USER))
      )
        return (
          <div className="flex gap-2">
            <Button
              title="Change password"
              size="icon"
              variant="outline"
              onClick={() => onChangePassword(data)}
            >
              <KeyRound />
            </Button>
            {data?.status !== USER_STATUS.BLOCKED ? (
              <Button
                title="Block user"
                size="icon"
                className="bg-slate-700"
                onClick={() => onBlock(data)}
              >
                <CircleSlash />
              </Button>
            ) : (
              <Button
                title="Reactivate user"
                size="icon"
                className="bg-green-700 hover:bg-green-800"
                onClick={() => onReactivate(data)}
              >
                <ShieldCheck />
              </Button>
            )}
            <Button
              title="Delete user"
              size="icon"
              variant="destructive"
              onClick={() => onDelete(data)}
            >
              <Trash2 />
            </Button>
          </div>
        );
      return (
        <span className="italic text-muted-foreground">No actions allowed</span>
      );
    },
  },
];
