'use client';

import { useEffect, useRef, useState } from 'react';
import { RoomProvider, ClientSideSuspense } from '@liveblocks/react/suspense';

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

import Header from './Header';
import { Editor } from './editor/Editor';

import ActiveCollaborators from './ActiveCollaborators';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Image from 'next/image';
import { updateRoom } from '@/lib/actions/room.actions';

export function CollaborativeRoom({
  roomId,
  roomMetadata,
}: {
  roomId: string;
  roomMetadata: RoomMetadata;
}) {
  const { title } = roomMetadata ?? 'New Document';
  const currentUserType = 'editor';

  const [documentTitle, setDocumentTitle] = useState(title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const enableEditing = () => setEditing(true);
  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(event.target.value);
  };

  const handleUpdateTitle = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === 'Enter') {
      setLoading(true);
      if (documentTitle !== title) {
        await updateRoom(roomId, documentTitle);
        setEditing(false);
        setLoading(false);
      }
    }
  }


  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if(containerRef.current && !containerRef.current.contains(e.target as Node)){
        setEditing(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return (() => {
      document.removeEventListener('mousedown', handleOutsideClick);
    })
  },[]);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        <div className="collaborative-room">
          <Header>
            <div
              ref={containerRef}
              className="flex w-fit items-center justify-center gap-2"
            >
              {editing && !loading ? (
                <>
                  <Input
                    type="text"
                    value={documentTitle}
                    ref={inputRef}
                    placeholder="Enter Title"
                    onChange={onTitleChange}
                    onKeyDown={handleUpdateTitle}
                    disabled={!editing}
                    className="document-title-input"
                  />
                </>
              ) : (
                <p className="document-title">{documentTitle}</p>
              )}
              {currentUserType === 'editor' && !editing && (
                <Button
                  className="flex gap-1 shadow-md"
                  onClick={enableEditing}
                >
                  <Image
                    src={'/assets/icons/edit.svg'}
                    alt="Edit title"
                    width={25}
                    height={25}
                  />
                </Button>
              )}

              {currentUserType !== 'editor' && !editing && (
                <p className="view-only-tag">View Only</p>
              )}

              {loading && <p className="text-sm text-gray-400">saving...</p>}
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
