// renderer/MainWindow.tsx (例)
import { MoveIcon, PlusIcon } from '@radix-ui/react-icons';
import { Box, Button, Card, Container, Flex, IconButton } from '@radix-ui/themes';
import React, { useEffect, useState, JSX } from 'react';

import './index.css'

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function MainWindow(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>([]);

  // マウント時にメインプロセスから付箋一覧を取得
  useEffect(() => {
    window.noteAPI
      .getNotes()
      .then((fetchedNotes) => {
        setNotes(fetchedNotes);
        return true;
      })
      .catch(() => {});
  }, []);

  // 新規付箋追加
  const addNote = async () => {
    const title = 'New Note';
    const content = '';
    const newNote = await window.noteAPI.addNote(title, content);
    // 追加に成功したらローカルステートも更新 or 全件再取得
    setNotes((prev) => [...prev, newNote]);
  };

  // 削除
  const deleteNote = async (noteId: string) => {
    await window.noteAPI.closeNoteWindow(noteId);
    const success = await window.noteAPI.deleteNote(noteId);
    if (success) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    }
  };

  return (
    <Container>
      <Box className='Top'>
        <Flex direction={'row'} align={'center'} gap={'4'}>
        <IconButton type="button" onClick={addNote} variant='soft'>
          <PlusIcon />
        </IconButton>
          <Button variant='ghost'>File</Button>
          <Button variant='ghost'>Edit</Button>
          <Button variant='ghost'>List</Button>   
        </Flex>
      </Box>
      <Box p='0.5rem'>
      <Flex direction={'column'} gap={'1'}>
        {notes.map((note) => (
          <Card variant='surface' size={'1'} key={note.id}>
            <strong>{note.title}</strong>
            <button
              type="button"
              onClick={() => {
                // サブウィンドウを開く (メインプロセスが生成)
                window.noteAPI.openNoteWindow(note.id);
              }}
              >
              開く
            </button>
            <button type="button" onClick={() => deleteNote(note.id)}>
              削除
            </button>
          </Card>
        ))}
      </Flex>
      </Box>
    </Container>
  );
}


export function NoteLabel(): JSX.Element {
  return(<></>)
}