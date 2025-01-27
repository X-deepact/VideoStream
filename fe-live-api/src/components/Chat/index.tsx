import { useState, useRef, useLayoutEffect, useEffect, FormEvent } from 'react';
import { Send, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import MessageItem from './MessageItem';
import Reactions, { OnReactOnLiveParams } from './Reactions';
import { LiveCommentInfo, LiveInitialStatsResponse } from '@/data/dto/chat';
import { UserAccountModel } from '@/data/model/userAccount';

interface ComponentProps {
  currentUser: UserAccountModel;
  initialStats: LiveInitialStatsResponse;
  onToggleVisibility: () => void;
  onReactOnLive: (params: OnReactOnLiveParams) => void;
  onCommentOnLive: (content: string) => void;
}

const Chat = (props: ComponentProps) => {
  const {
    currentUser,
    initialStats,
    onToggleVisibility,
    onReactOnLive,
    onCommentOnLive,
  } = props;

  const [input, setInput] = useState('');
  const [contentHeight, setContentHeight] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const inputLength = input.trim().length;

  const handleMessageSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputLength === 0) return;
    onCommentOnLive(input);
    setInput('');
  };

  useLayoutEffect(() => {
    if (cardRef.current && headerRef.current && footerRef.current) {
      const cardHeight = cardRef.current.offsetHeight;
      const headerHeight = headerRef.current.offsetHeight;
      const footerHeight = footerRef.current.offsetHeight;

      // Subtract header and footer heights from the total card height
      setContentHeight(cardHeight - (headerHeight + footerHeight));
    }
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [initialStats.comments]);

  return (
    <Card
      className="h-full flex flex-col border-none overflow-hidden box-border"
      ref={cardRef}
    >
      <CardHeader ref={headerRef} className="border-b py-1 pl-3.5 pr-1">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium leading-none">Live Chat</p>
          <div
            onClick={onToggleVisibility}
            className="rounded-full cursor-pointer p-2 hover:bg-secondary/50"
            title="Close"
          >
            <X strokeWidth={1} className="w-5 h-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent
        ref={contentRef}
        style={{ height: contentHeight + 'px', overflow: 'auto' }}
        className="px-2 pb-3"
      >
        <div className="space-y-2 pt-2">
          {initialStats?.comments?.map((message: LiveCommentInfo) => (
            <div
              key={message.id}
              className={cn(
                'gap-0 rounded-md px-2 py-1 text-xs w-max max-w-[95%]',
                message.username === currentUser.username
                  ? 'ml-auto bg-background border text-black dark:text-white'
                  : 'bg-muted dark:bg-muted/60'
              )}
            >
              <MessageItem
                // isSelfSent={message.username === currentUser.username}
                content={message.content}
                avatarUrl={message.avatar_url}
                displayName={message.display_name}
                createdAt={message.created_at}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter
        className="p-2 border-t justify-stretch box-border"
        ref={footerRef}
      >
        <div className="w-full">
          <Reactions
            stats={{
              likeCount: initialStats.like_count,
              likeInfo: initialStats.like_info,
              currentReactionType: initialStats?.current_like_type,
            }}
            onReactOnLive={onReactOnLive}
          />
          <form
            onSubmit={handleMessageSend}
            className="flex w-full items-center space-x-2 pt-1"
          >
            <Input
              id="message"
              placeholder="Chat..."
              className="flex-1 dark:bg-black bg-white"
              autoComplete="off"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <Button type="submit" size="icon" disabled={inputLength === 0}>
              <Send />
            </Button>
          </form>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Chat;
