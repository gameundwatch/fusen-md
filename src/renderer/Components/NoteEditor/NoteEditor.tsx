import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Box, Container, Flex, IconButton, Separator } from '@radix-ui/themes';
import {
  CheckboxIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeIcon,
  Cross1Icon,
  DotsHorizontalIcon,
  FontBoldIcon,
  FontItalicIcon,
  GearIcon,
  HeadingIcon,
  ListBulletIcon,
  Pencil2Icon,
  QuoteIcon,
  StrikethroughIcon,
} from '@radix-ui/react-icons';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import './index.css';
import './MdViewer.css';
import { Note } from '../../../common/note';

const closeNote = async (noteId: string) => {
  await window.noteAPI.closeNoteWindow(noteId);
};

export function NoteEditor() {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const noteId = params.noteId as string | undefined;
  const [note, setNote] = useState<Note | null>(null);
  const [draft, setDraft] = useState('');
  const [isActive, setIsActive] = useState(true);

  const saveContent = async () => {
    if (note) {
      // noteの更新
      await window.noteAPI.updateNote(note.id, note.title, draft);
      // noteの再取得
      window.noteAPI
        .getNote(note.id)
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
    if (!noteId) return;

    window.noteAPI
      .getNote(noteId)
      .then((fetchedNote) => {
        setNote(fetchedNote);
        setDraft(fetchedNote.content);
        return true;
      })
      .catch((error) => {
        console.error('Failed to fetch note:', error);
      });
  }, [noteId]);

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
      {isActive ? (
        <Flex direction="column" width="100%" height="100%" justify="between">
          <Box
            width="100%"
            height="24px"
            minHeight="24px"
            className="Top DragAnchor"
            p="1"
            flexGrow="0"
          >
            <Flex width="100%" direction="row" align="center" justify="between">
              <Box flexGrow="1">
                <Flex direction="row" align="center" justify="start" gap="2">
                  <IconButton
                    type="button"
                    variant="ghost"
                    radius="none"
                    size="1"
                  >
                    <Pencil2Icon />
                  </IconButton>
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
              <Box flexGrow="0">
                <Flex direction="row" align="center" justify="end" gap="2">
                  <IconButton
                    type="button"
                    variant="ghost"
                    radius="none"
                    size="1"
                    onClick={() => closeNote(note.id)}
                  >
                    <Cross1Icon />
                  </IconButton>
                </Flex>
              </Box>
            </Flex>
          </Box>
          <Box width="100%" className="Edit" px="2" py="1" flexGrow="0">
            <Flex width="100%" direction="row" align="center" justify="between">
              <Box flexGrow="1">
                <Flex direction="row" align="center" justify="start" gap="2">
                  <IconButton
                    type="button"
                    variant="ghost"
                    radius="small"
                    size="1"
                  >
                    <ChevronLeftIcon />
                  </IconButton>
                  <IconButton
                    type="button"
                    variant="ghost"
                    radius="small"
                    size="1"
                  >
                    <ChevronRightIcon />
                  </IconButton>
                  <Separator orientation="vertical" size="1" />
                  <IconButton
                    type="button"
                    variant="ghost"
                    radius="small"
                    size="1"
                  >
                    <FontBoldIcon />
                  </IconButton>
                  <IconButton
                    type="button"
                    variant="ghost"
                    radius="small"
                    size="1"
                  >
                    <FontItalicIcon />
                  </IconButton>
                  <IconButton
                    type="button"
                    variant="ghost"
                    radius="small"
                    size="1"
                  >
                    <StrikethroughIcon />
                  </IconButton>
                  <IconButton
                    type="button"
                    variant="ghost"
                    radius="small"
                    size="1"
                  >
                    <HeadingIcon />
                  </IconButton>
                  <Separator orientation="vertical" size="1" />
                  <IconButton
                    type="button"
                    variant="ghost"
                    radius="small"
                    size="1"
                  >
                    <CodeIcon />
                  </IconButton>
                  <IconButton
                    type="button"
                    variant="ghost"
                    radius="small"
                    size="1"
                  >
                    <QuoteIcon />
                  </IconButton>
                  <IconButton
                    type="button"
                    variant="ghost"
                    radius="small"
                    size="1"
                  >
                    <ListBulletIcon />
                  </IconButton>
                  <IconButton
                    type="button"
                    variant="ghost"
                    radius="small"
                    size="1"
                  >
                    <CheckboxIcon />
                  </IconButton>
                  <IconButton
                    type="button"
                    variant="ghost"
                    radius="small"
                    size="1"
                  >
                    <DotsHorizontalIcon />
                  </IconButton>
                </Flex>
              </Box>
            </Flex>
          </Box>
          <Box width="100%" flexGrow="1" className="Body">
            <textarea
              value={draft}
              className="MdEditor"
              onChange={(e) => setDraft(e.target.value)}
              onBlur={saveContent} // 焦点が外れたら保存
            />
          </Box>
        </Flex>
      ) : (
        <Flex direction="column" width="100%" height="100%" justify="between">
          <Box
            width="100%"
            height="24px"
            minHeight="24px"
            className="Top DragAnchor"
            p="1"
            flexGrow="0"
          />
          <Box width="100%" flexGrow="1" className="Body">
            <Box className="MdViewer" p="1">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </Box>
          </Box>
        </Flex>
      )}
    </Container>
  );
}

export default NoteEditor;
