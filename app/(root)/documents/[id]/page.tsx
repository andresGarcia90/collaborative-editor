import { CollaborativeRoom } from '@/components/Room';
import { getDocument } from '@/lib/actions/room.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

const Document = async ({params: {id}}: SearchParamProps) => {
  const clerkUser = await currentUser();

  if (!clerkUser) redirect('/sign-in');

  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) redirect('/');

  const { metadata }: {metadata: RoomMetadata} = room;

  //TODO: Add access control
  // console.log("Room ", room);
  

  return (
    <main className='flex w-full flex-col items-center'>
      <CollaborativeRoom roomId={id} roomMetadata={metadata}/>
    </main>
  );
};

export default Document;
