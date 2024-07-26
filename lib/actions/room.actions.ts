'use server';

import { nanoid } from 'nanoid';
import liveblocks from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { parseStringify } from '../utils';
import { RoomData } from '@liveblocks/node';

export const createRoom = async ({ userId, email }: CreateDocumentParams) => {
  const roomId = nanoid();
  try {
    const metadata = {
      creatorId: userId,
      email,
      title: 'Untitled Document',
    };

    const usersAccesses: RoomAccesses = {
      [email]: ['room:write'],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      defaultAccesses: [],
      usersAccesses,
    });

    revalidatePath('/');
    return parseStringify(room);
  } catch (error) {
    console.error(`Error creating room: ${error}`);
  }
};

export const getDocument = async ({ roomId, userId }: { roomId: string; userId: string;}) => {
  try {
    const room: RoomData = await liveblocks.getRoom(roomId);

    const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    if (!hasAccess) {
      throw new Error('Room not found');
    }

    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while getting a room: ${error}`);
  }
};
