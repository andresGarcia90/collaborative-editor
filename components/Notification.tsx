'use client';
import { useInboxNotifications } from '@liveblocks/react/suspense';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';
import { InboxNotification, LiveblocksUIConfig } from '@liveblocks/react-ui';
import { ReactNode } from 'react';

const Notification = () => {
  const { inboxNotifications } = useInboxNotifications();
  const unreadNotifications = inboxNotifications.filter(
    (inboxNotification) => !inboxNotification.readAt
  );
  return (
    <Popover>
      <PopoverTrigger className="relative flex size-10 items-center justify-center rounded-lg">
        <Image 
          src="/assets/icons/bell.svg"
          alt="inbox"
          width={24}
          height={24}
        />
        {unreadNotifications.length > 0 && ( <div className="absolute right-2 top-2 z-20 size-2 rounded-full bg-red-500" />)}
      </PopoverTrigger>
      <PopoverContent align="end" className="shad-popover">
        <LiveblocksUIConfig
          overrides={{
            INBOX_NOTIFICATION_TEXT_MENTION: (user: ReactNode) => (
              <>{user} mentioned you.</>
            ),
          }}
        >
          {unreadNotifications.length <= 0 ? (
            <p className="text-center text-dark-500 py-2">
              No new notifications
            </p>
          ) : (
            unreadNotifications.map((inboxNotification) => (
              <InboxNotification
                key={inboxNotification.id}
                inboxNotification={inboxNotification}
                className="bg-dark-200 text-white"
                href={`/documents/${inboxNotification.roomId}`}
                showActions={false}
                kinds={{
                  thread: (props) => (
                    <InboxNotification.Thread
                      {...props}
                      showActions={false}
                      showRoomName={false}
                    />
                  ),
                  textMention: (props) => (
                    <InboxNotification.TextMention
                      {...props}
                      showRoomName={false}
                    />
                  ),
                  $documentAccess: (props) => (
                    <InboxNotification.Custom
                      {...props}
                      title={props.inboxNotification.activities[0].data.title}
                      aside={
                        <InboxNotification.Icon className="bg-transparent">
                          <Image
                            src={ (props.inboxNotification.activities[0].data.avatar as string) || '' }
                            width={36}
                            height={36}
                            alt="Avatar"
                            className="rounded-full"
                          />
                        </InboxNotification.Icon>
                      }
                    >
                      {props.children}
                    </InboxNotification.Custom>
                  ),
                }}
              />
            ))
          )}
        </LiveblocksUIConfig>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;