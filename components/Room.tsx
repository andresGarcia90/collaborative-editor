'use client';

import { RoomProvider, ClientSideSuspense } from '@liveblocks/react/suspense';

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

import Header from './Header';
import { Editor } from './editor/Editor';

import ActiveCollaborators from './ActiveCollaborators';

export function CollaborativeRoom({roomId, roomMetadata}: {roomId: string, roomMetadata: RoomMetadata}) {
  // console.log("CollaborativeRoom ", roomId);
  
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        <div className="collaborative-room">
          <Header>
            <div className="flex w-fit items-center justify-center gap-2">
              <p className="document-title">Share</p>
            </div>

            <div className="flex w-full flex-1 justify-end gap-2">
              <ActiveCollaborators />
            </div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Header>

          <Editor />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
}
