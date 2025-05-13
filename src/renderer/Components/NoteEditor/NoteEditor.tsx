import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

import { Box, Container, Flex, IconButton, Text } from '@radix-ui/themes';
import { Cross1Icon, FileIcon, Pencil1Icon } from '@radix-ui/react-icons';

import './index.css';
import './MdViewer.css';
import './MdEditor.css';
import './markdown/default.css';
import './markdown/custom.css';

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
  const [isEdit, setIsEdit] = useState(false);

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
    // ウィンドウ関連のイベントハンドラ
    const handleBlur = () => {
      setIsEdit((prev) => (prev ? false : prev));
    };
    window.addEventListener('blur', handleBlur);
    // アンマウント時に解除
    return () => {
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
      className={isEdit ? 'Note Active' : 'Note Inactive'}
    >
      <Flex direction="column" width="100%" height="100%" justify="between">
        <Box
          width="100%"
          height="24px"
          minHeight="24px"
          className="Top"
          p="1"
          onMouseDown={() => setIsEdit(true)}
        >
          <Flex width="100%" align="center" justify="between">
            {/* 上部左側（書き込みトグル、ファイルエクスポートなど） */}
            <IconButton className="NoteTopUi" variant="ghost" size="1">
              {isEdit ? (
                <FileIcon onClick={() => setIsEdit(!isEdit)} />
              ) : (
                <Pencil1Icon onClick={() => setIsEdit(!isEdit)} />
              )}
            </IconButton>
            {/* ラベル */}
            <Text align="center" className="NoteTopLabel DragAnchor" size="1">
              {note.title}
            </Text>
            <IconButton
              type="button"
              variant="ghost"
              radius="none"
              color="red"
              size="1"
              onClick={() => closeNote(note.title)}
            >
              <Cross1Icon />
            </IconButton>
          </Flex>
        </Box>
        <NoteToolbar />
        {isEdit ? (
          <Box width="100%" flexGrow="1" className="Body">
            <textarea
              value={draft}
              className="MdEditor Scrollable"
              onChange={(e) => setDraft(e.target.value)}
              onBlur={saveContent} // 焦点が外れたら保存
            />
          </Box>
        ) : (
          <Box width="100%" flexGrow="1" className="Body">
            <Box className="MdViewer Scrollable markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {
                  // Windows用 CRLF -> CR 修正
                  note.content.replace(/\r\n/g, '\n')
                }
              </ReactMarkdown>
            </Box>
          </Box>
        )}
      </Flex>
    </Container>
  );
}

export default NoteEditor;
