'use client';
import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import Image from 'next/image';
import { deleteRoom } from '@/lib/actions/room.actions';

const DeleteModal = ({ roomId, title }: { roomId: string; title: string }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteDocumentHandler = async () => {
    setLoading(true);
    await deleteRoom(roomId);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="remove-btn flex h-9 gap-1 px-4">
          <Image
            src="/assets/icons/delete.svg"
            alt="Delete"
            width={20}
            height={20}
            className="min-w-4 md:size-5"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog">
        <DialogHeader>
          <DialogTitle>Delete {title}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            document.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-end">
          <Button className="gradient-red flex h-9 gap-1 px-4" onClick={deleteDocumentHandler}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
