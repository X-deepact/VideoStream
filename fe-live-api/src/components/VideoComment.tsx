import { useEffect, useState, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import useComments from '@/hooks/useComments';
import AppAvatar from './AppAvatar';
import { getTimeAgoFormat } from '@/lib/date-time';
import { getAvatarFallbackText } from '@/lib/utils';
import { createComment, deleteComment, updateComment } from '@/services/stream';
import { CommentsResponse } from '@/data/dto/stream';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  EllipsisVertical,
  MessageSquare,
  MessageSquareOff,
  Pencil,
  Trash,
} from 'lucide-react';
import { ConfirmationModalProps, ConfirmModal } from './ConfirmationModal';
import { modalTexts } from '@/data/comment';
import { showToastMessage } from '@/lib/toast';
import { DEFAULT_PAGE_SIZE } from '@/data/validations';

interface ComponentProps {
  videoId: number;
}

const VideoComment = ({ videoId }: ComponentProps) => {
  const [newComment, setNewComment] = useState('');
  const [isApiCommentCreating, setIsApiCommentCreating] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isApiCommentUpdating, setIsApiCommentUpdating] = useState(false);
  const [isInvalidEditingComment, setIsInvalidEditingComment] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmationModalProps>({
    isDanger: false,
    isOpen: false,
    title: '',
    description: '',
    proceedBtnText: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const {
    comments,
    isLoading,
    totalItems,
    fetchNextPage,
    setComments,
    setTotalItems,
  } = useComments({
    videoId,
    limit: DEFAULT_PAGE_SIZE,
  });

  // Create comment
  const handleCreateComment = async () => {
    if (!newComment.trim()) return;

    if (videoId) {
      setIsApiCommentCreating(true);
      const data = await createComment({
        videoId,
        content: newComment,
      });
      if (data) {
        setNewComment('');
        comments.unshift({
          ...data,
          is_me: true,
        } as unknown as CommentsResponse);
        setTotalItems((prev) => prev + 1);
      }
      setIsApiCommentCreating(false);
    }
  };
  const handleClearComment = () => {
    setNewComment('');
  };

  // Delete comment
  const handleDeleteComment = (commentId: number) => {
    openConfirmModal(
      modalTexts.comment.confirmToDelete.title,
      modalTexts.comment.confirmToDelete.description,
      () => handleDeleteCommentConfirmed(commentId),
      true,
      'Confirm to Delete'
    );
  };
  const handleDeleteCommentConfirmed = async (commentId: number) => {
    const isSuccess = await deleteComment(commentId);
    if (isSuccess) {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );

      setTotalItems((prev) => prev - 1);

      showToastMessage(
        'Comment deleted',
        <MessageSquareOff className="w-4 h-4" />
      );
    }
  };

  // Edit comment
  const handleEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
    setOriginalContent(content);
  };
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };
  const handleSaveEdit = async (commentId: number) => {
    if (!editingContent.trim() && isInvalidEditingComment) return;

    setIsApiCommentUpdating(true);
    const updatedComment = await updateComment({
      commentId,
      content: editingContent,
    });
    if (updatedComment) {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: editingContent, is_edited: true }
            : comment
        )
      );
      handleCancelEdit();

      showToastMessage(
        'Comment updated',
        <MessageSquare className="w-4 h-4" />
      );
    }
    setIsApiCommentUpdating(false);
  };

  useEffect(() => {
    if (editingCommentId) {
      if (
        originalContent.trim() === editingContent.trim() ||
        editingContent.length === 0
      ) {
        setIsInvalidEditingComment(true);
      } else setIsInvalidEditingComment(false);
    }
  }, [editingCommentId, editingContent, originalContent]);

  // Modal dialogs
  const openConfirmModal = (
    title: string,
    description: string | JSX.Element,
    onConfirm: () => void,
    isDanger?: boolean,
    proceedBtnText?: string
  ): void => {
    setConfirmModal({
      isDanger,
      title,
      description,
      isOpen: true,
      proceedBtnText,
      onConfirm: () => {
        closeConfirmationModal();
        onConfirm();
      },
      onCancel: closeConfirmationModal,
    });
  };
  const closeConfirmationModal = (): void => {
    setConfirmModal({
      isOpen: false,
      title: '',
      description: '',
      onConfirm: () => {},
      onCancel: () => {},
    });
  };

  return (
    <div className="space-y-4 mt-5 w-full lg:w-2/3">
      {/* Comment Count */}
      <h2 className="text-lg font-semibold">
        {totalItems} {totalItems === 1 ? 'Comment' : 'Comments'}
      </h2>

      {/* New Comment Input */}
      <div className="space-y-2">
        <Textarea
          placeholder="Add a public comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="resize-none"
        />
        {newComment.length > 0 && (
          <div className="flex justify-end">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClearComment}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleCreateComment}
                disabled={!newComment.trim() || isApiCommentCreating}
              >
                {isApiCommentCreating ? 'Commenting...' : 'Comment'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Existing Comments */}
      <div className="space-y-6">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex items-start w-full">
            <div className="flex space-x-4 w-full">
              <AppAvatar
                classes="w-10 h-10 object-cover"
                url={comment?.avatar_url}
                fallback={getAvatarFallbackText(comment?.display_name)}
              />
              <div className="space-y-1 w-full">
                <div className="flex items-center justify-start space-x-2">
                  <p className="font-semibold text-sm">
                    {comment?.display_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-muted-foreground">•</p>
                  <p className="text-xs text-muted-foreground">
                    {getTimeAgoFormat(comment?.created_at)}
                  </p>
                  {comment?.is_edited && (
                    <Fragment>
                      <p className="text-xs text-muted-foreground">•</p>
                      <p className="italic text-muted-foreground text-xs ml-2 inline">
                        Edited
                      </p>
                    </Fragment>
                  )}
                </div>
                {editingCommentId === comment.id ? (
                  <Fragment>
                    <Textarea
                      autoFocus
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="resize-none w-full"
                      style={{ width: '100%' }}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={
                          isInvalidEditingComment || isApiCommentUpdating
                        }
                        onClick={() => handleSaveEdit(comment.id)}
                      >
                        {isApiCommentUpdating ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </Fragment>
                ) : (
                  <p className="text-sm text-foreground">{comment?.content}</p>
                )}
              </div>
            </div>

            {comment.is_me && editingCommentId !== comment.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-8 w-8 p-0" variant="ghost">
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      handleEditComment(comment?.id, comment.content)
                    }
                    className="cursor-pointer group"
                  >
                    <p className="flex items-center gap-2 text-sm group-hover:text-primary">
                      <Pencil className="w-3 h-3" /> Edit
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteComment(comment?.id)}
                    className="cursor-pointer group"
                  >
                    <p className="flex items-center gap-2 text-sm group-hover:text-red-600">
                      <Trash className="w-3 h-3" /> Delete
                    </p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {comments.length < totalItems && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="link"
            className="p-0"
            onClick={fetchNextPage}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}

      {/* end of result */}
      {comments.length === totalItems && (
        <div className="mt-4 flex justify-center text-muted-foreground italic text-sm">
          <p className="p-0">— End of comments —</p>
        </div>
      )}

      <ConfirmModal
        isDanger={confirmModal.isDanger}
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        proceedBtnText={confirmModal.proceedBtnText}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmationModal}
      />
    </div>
  );
};

export default VideoComment;
