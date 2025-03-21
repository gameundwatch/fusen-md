// renderer/MainWindow.tsx (例)
import { GearIcon, Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';
import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Text,
} from '@radix-ui/themes';
import React, { useEffect, useState, JSX } from 'react';

import './index.css';
import { TopBar } from './TopBar/TopBar';
import { NoteLabel } from './NoteLabel';
import { Note } from '../../../common/note';

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
      <Flex className="MainWindow" direction="column" justify="between">
        <TopBar />
        <Box className="MainContents" p="0.5rem">
          <Flex direction="column" justify="start" gap="2">
            {notes.map((note) => (
              <NoteLabel note={note} deleteNote={deleteNote} />
            ))}
            <Button variant="outline" onClick={addNote}>
              <PlusIcon /> New
            </Button>
          </Flex>
        </Box>
        <Box className="Foot" py="1" px="2" flexGrow="0">
          <Flex direction="row" align="center" justify="between">
            <Box flexGrow="1">
              <Flex direction="row" align="center" justify="start" gap="4">
                <Text size="1">Logging...</Text>
              </Flex>
            </Box>
            <Box flexGrow="1">
              <Flex direction="row" align="center" justify="end">
                <IconButton
                  type="button"
                  variant="ghost"
                  radius="none"
                  size="1"
                >
                  <GearIcon />
                </IconButton>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
}

export default MainWindow;
