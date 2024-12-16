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
import { initialMessages } from './data';
import AvatarPhoto from '@/assets/images/pf.jpeg';
import MessageItem from './MessageItem';

interface ComponentProps {
  onToggleVisibility: () => void;
}

const Chat = (props: ComponentProps) => {
  const { onToggleVisibility } = props;

  const [messages, setMessages] = useState(initialMessages);
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
    setMessages([
      ...messages,
      {
        avatarUrl: AvatarPhoto,
        username: 'user98234',
        role: 'user',
        content: input,
        createdAt: '2024-12-09 15:45:41.444898+06:30',
      },
    ]);
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
  }, [messages]);

  return (
    <Card
      className="h-full flex flex-col border-none p-0 overflow-hidden box-border"
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
        className="px-3 pb-3"
      >
        <div className="space-y-2 pt-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'w-max gap-2 rounded-md px-2 py-1 text-xs max-w-[95%] text-primary-foreground/90',
                message.role === 'user'
                  ? 'ml-auto bg-primary/50'
                  : 'bg-muted/60'
              )}
            >
              <MessageItem
                content={message.content}
                avatarUrl={message.avatarUrl}
                username={message.username}
                createdAt={message.createdAt}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-2 border-t" ref={footerRef}>
        <form
          onSubmit={handleMessageSend}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Chat..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button type="submit" size="icon" disabled={inputLength === 0}>
            <Send />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Chat;
