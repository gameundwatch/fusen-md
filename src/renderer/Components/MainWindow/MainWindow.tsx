// renderer/MainWindow.tsx (例)
import { GearIcon, PlusIcon } from '@radix-ui/react-icons';
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
    // 現在時刻からファイル名を自動生成
    const date = new Date();
    const title =
      'untitled_' +
      String(date.getFullYear()).padStart(4, '0') +
      String(date.getMonth()).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0') +
      '_' +
      String(date.getHours()).padStart(2, '0') +
      String(date.getMinutes()).padStart(2, '0') +
      String(date.getSeconds()).padStart(2, '0');

    const content = '';
    const newNotes = await window.noteAPI.addNote(title, content);

    // 追加に成功したらローカルステートも更新 or 全件再取得
    setNotes(newNotes);
  };

  // 削除
  const deleteNote = async (title: string) => {
    await window.noteAPI.closeNoteWindow(title);
    const newNotes = await window.noteAPI.deleteNote(title);
    setNotes(newNotes);
  };

  // リネーム
  const renameNote = async (targetName: string, newName: string) => {
    // await window.noteAPI.closeNoteWindow(title);
    const newNotes = await window.noteAPI.renameNote(targetName, newName);
    setNotes(newNotes);
  };

  return (
    <Container>
      <Flex className="MainWindow" direction="column" justify="between">
        <TopBar />
        <Box className="MainContents Scrollable" p="0.5rem">
          <Flex direction="column" justify="start" gap="2">
            {notes.map((note) => (
              <NoteLabel
                key={note.title}
                note={note}
                renameNote={renameNote}
                deleteNote={deleteNote}
              />
            ))}
            <Button variant="outline" onClick={addNote}>
              <PlusIcon /> New
            </Button>
          </Flex>
        </Box>
        <Box className="Foot" py="1" px="2" flexGrow="0">
          <Flex direction="row" align="center" justify="between">
            <Box flexGrow="1">
              <Text size="1">Logging...</Text>
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
