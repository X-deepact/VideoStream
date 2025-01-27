import { useState, useCallback, useEffect } from 'react';
import { fetchCommentsList } from '@/services/stream';
import { CommentsListRequest, CommentsResponse } from '@/data/dto/stream';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/data/validations';

const useComments = (payload: CommentsListRequest) => {
  const { page = DEFAULT_PAGE, limit = DEFAULT_PAGE_SIZE, videoId } = payload;

  const [comments, setComments] = useState<CommentsResponse[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);

  // Fetch Comments Data
  const fetchCommentsData = useCallback(
    async (page: number) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchCommentsList({
          page,
          limit,
          videoId,
        } as CommentsListRequest);

        if (!response?.page) {
          throw new Error('Failed to fetch comments!');
        }

        setComments((prev) => [
          ...prev,
          ...(response.page?.filter(
            (newComment) =>
              !prev.some(
                (existingComment) => existingComment.id === newComment.id
              )
          ) || []),
        ]);
        setTotalItems(response.total_items || 0);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [limit, videoId]
  );

  useEffect(() => {
    // Fetch initial comments on mount or when videoId changes
    fetchCommentsData(DEFAULT_PAGE);
  }, [fetchCommentsData]);

  // Refetch for manual reset
  const refetchContents = useCallback(() => {
    setComments([]);
    setCurrentPage(DEFAULT_PAGE);
    fetchCommentsData(DEFAULT_PAGE);
  }, [fetchCommentsData]);

  // Fetch the next page
  const fetchNextPage = useCallback(() => {
    if (!isLoading && comments.length < totalItems) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchCommentsData(nextPage);
    }
  }, [isLoading, comments, totalItems, currentPage, fetchCommentsData]);

  return {
    comments,
    isLoading,
    totalItems,
    error,
    setComments,
    setTotalItems,
    refetchContents,
    fetchNextPage,
  };
};

export default useComments;
