// renderer/MainWindow.tsx (例)
import { FileTextIcon, Pencil1Icon, PlusIcon, SunIcon, TrashIcon } from '@radix-ui/react-icons';
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  IconButton,
  Inset,
  Separator,
  Text,
} from '@radix-ui/themes';
import React, { useEffect, useState, JSX } from 'react';

import './index.css';

type Note = {
  id: string;
  title: string;
  content: string;
};

export function MainWindow(): JSX.Element {
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
      <Flex className="AppWindow" direction="column" justify="between">
      <Box className="Top DragAnchor">
        <Flex direction="row" align="center" justify="between">
          <Box className='MenuContents'>
            <Flex ml="2" direction="row" align="center" gap="4">
              <SunIcon color="violet"/>
              <Button variant="ghost">File</Button>
              <Button variant="ghost">Edit</Button>
              <Button variant="ghost">List</Button>
            </Flex>
          </Box>
          <Box className="WindowControls"></Box>
        </Flex>
      </Box>
      <Box className="MainContents" p="0.5rem">
        <Flex direction="column" justify="start" gap="2">
          {notes.map((note) => (
            <Card className="FusenCard" variant="surface" key={note.id}>
              <Flex direction="row" align="center" justify="between">
                <Text size="2" weight="bold">
                  {note.title}
                </Text>
                <Box>
                  <Flex direction="row" align="center" gap="4">
                    <Text size="1" color="gray">
                      {/* {note.date} */"YYYY/MM/DD"}
                    </Text>
                    <IconButton
                      variant="ghost"
                      radius="full"
                      onClick={() => {
                        window.noteAPI.openNoteWindow(note.id);
                      }}
                      >
                      <FileTextIcon scale="4" />
                    </IconButton>
                    <IconButton
                      color="red"
                      className="DeleteButton"
                      variant="ghost"
                      radius="full"
                      onClick={() => deleteNote(note.id)}>
                      <TrashIcon scale="4" />
                    </IconButton>
                  </Flex>
                </Box>
              </Flex>
            </Card>
          ))}
        </Flex>
      </Box>
      <Box className="Foot">
      <Flex direction="row" align="center" gap="4">
        <Button type="button" onClick={addNote} variant="soft" radius="full" size="1">
          New Note
          <Pencil1Icon />
        </Button>
      </Flex>
      </Box>
      </Flex>
    </Container>
  );
}
