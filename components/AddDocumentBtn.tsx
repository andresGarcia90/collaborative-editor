'use client';

import React from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { createRoom } from '@/lib/actions/room.actions';
import { useRouter } from 'next/navigation';

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {

  const route = useRouter();

  const addDocumentHandler = async () => {
    try {
      const room = await createRoom({ userId, email });
      route.push(`/documents/${room.id}`);
    } catch (error) {
      
    }  
  }

  return (
    <Button type='submit' onClick={addDocumentHandler} className='gradient-blue flex gap-1 shadow-md'>
      <Image
        src='assets/icons/add.svg'
        alt='Add'
        width={24}
        height={24}
       />
       <p className="hidden sm:block">Start a blank document</p>
    </Button>
  );
};

export default AddDocumentBtn;
