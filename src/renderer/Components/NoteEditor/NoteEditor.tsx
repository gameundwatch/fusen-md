import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Box, Container, Flex } from '@radix-ui/themes';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import './index.css';
import './MdViewer.css';
import { Note } from '../../../common/note';
import { NoteToolbar } from './NoteToolBar';

const closeNote = async (title: string) => {
  await window.noteAPI.closeNoteWindow(title);
};

export function NoteEditor() {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const title = params.title as string | undefined;
  const [note, setNote] = useState<Note | null>(null);
  const [draft, setDraft] = useState('');
  const [isActive, setIsActive] = useState(true);

  const saveContent = async () => {
    if (note) {
      // noteの更新、保存
      await window.noteAPI.updateNote(note.title, draft);
      // noteの再取得
      window.noteAPI
        .getNote(note.title)
        .then((fetchedNote) => {
          setNote(fetchedNote);
          setDraft(fetchedNote.content);
          return true;
        })
        .catch((error) => {
          console.error('Failed to fetch note:', error);
        });
    }
  };

  useEffect(() => {
    if (!title) return;

    window.noteAPI
      .getNote(title)
      .then((fetchedNote) => {
        setNote(fetchedNote);
        setDraft(fetchedNote.content);
        return true;
      })
      .catch((error) => {
        console.error('Failed to fetch note:', error);
      });
  }, [title]);

  useEffect(() => {
    const handleFocus = () => {
      setIsActive(true);
    };
    const handleBlur = () => {
      setIsActive((prev) => (prev ? false : prev));
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // アンマウント時に解除
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  if (!note) {
    return <Box className="Body">該当する付箋がありません</Box>;
  }

  return (
    <Container
      width="100%"
      height="100vh"
      className={isActive ? 'Note Active' : 'Note Inactive'}
    >
      <Flex direction="column" width="100%" height="100%" justify="between">
        <Box
          width="100%"
          height="16px"
          minHeight="16px"
          className="Top DragAnchor"
          p="1"
          flexGrow="0"
        >
          <Flex width="100%" direction="row" align="center" justify="between">
            <Box flexGrow="1">
              <Flex direction="row" align="center" justify="start" gap="2" />
            </Box>
            <Box flexGrow="0">
              <Flex direction="row" align="center" justify="end" gap="2" />
            </Box>
          </Flex>
        </Box>
        <NoteToolbar closeNote={() => closeNote(note.title)} />
        {isActive ? (
          <Box width="100%" flexGrow="1" className="Body">
            <textarea
              value={draft}
              className="MdEditor"
              onChange={(e) => setDraft(e.target.value)}
              onBlur={saveContent} // 焦点が外れたら保存
            />
          </Box>
        ) : (
          <Box width="100%" flexGrow="1" className="Body">
            <Box className="MdViewer">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </Box>
          </Box>
        )}
      </Flex>
    </Container>
  );
}

export default NoteEditor;
