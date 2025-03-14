import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import ReactMarkdown from 'react-markdown';
import { Box, Button, Container, Flex, IconButton, TextArea } from '@radix-ui/themes';
import { Cross1Icon, EyeClosedIcon, GearIcon, HomeIcon, Pencil2Icon, TextIcon } from '@radix-ui/react-icons';

import "./index.css"
import "./MdViewer.css"

type Note = {
  id: string;
  title: string;
  content: string;
};

const closeNote = async (noteId: string) => {
  await window.noteAPI.closeNoteWindow(noteId);
};

export function NoteEditor() {
  const location = useLocation();
  const params = queryString.parse(location.search);
  const noteId = params.noteId as string | undefined;

  const [note, setNote] = useState<Note | null>(null);
  const [draft, setDraft] = useState('');
  // ウィンドウがアクティブかどうか
  const [isActive, setIsActive] = useState(true);

  // マウント時にメインプロセスから該当付箋を取得
  useEffect(() => {
    window.noteAPI
      .getNote(noteId)
      .then((fetched) => {
        if (fetched) {
          setNote(fetched);
          setDraft(fetched.content);
        }
        return true;
      })
      .catch((e) => {
        console.log(e);
      });
  }, [noteId]);

  useEffect(() => {
    const handleFocus = () => {
      // すでに true の場合は更新しないようにし、再レンダループを防ぐ
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

  // noteId が取れなければエラー
  if (!noteId) {
    return <div>noteIdが指定されていません</div>;
  }

  if (!note) {
    return <div>該当する付箋がありません</div>;
  }

  // 更新 (Draft確定時)
  const saveContent = async () => {
    const updated = await window.noteAPI.updateNote(note.id, note.title, draft);
    if (updated) {
      setNote(updated);
    }
  };

  return (
    <Container width="100%" height="100vh" className="NoteEditor">
      <Flex direction="column" width="100%" height="100%" justify="between">
      <Box width="100%" minHeight="24px" className="Top DragAnchor" p="1" flexGrow="0">
      <Flex width="100%" direction="row" align="center" justify="between">
      { isActive?
        <>
          <Box flexGrow="1">
            <Flex direction="row" align="center" justify="start" gap="2">
              <IconButton type="button" variant="ghost" radius="none" size="1">
                <Pencil2Icon/>
              </IconButton>
              <IconButton type="button" variant="ghost" radius="none" size="1">
                <GearIcon />
              </IconButton>
            </Flex>
          </Box>
          <Box flexGrow="0">
            <Flex direction="row" align="center" justify="end" gap="2">
              <IconButton type="button" variant="ghost" radius="none" size="1" onClick={()=>closeNote(noteId)}>
                <Cross1Icon />
              </IconButton>
            </Flex>
          </Box>
        </>
      : <></> }
      </Flex>
      </Box>
      <Box width="100%" flexGrow="1" className="Body">
      {isActive ? (
        <TextArea
        value={draft}
        variant="surface"
        className="MdEditor"
        radius="none"
        onChange={(e) => setDraft(e.target.value)}
        onBlur={saveContent} // 焦点が外れたら保存
        />
      ) : (
        <Box className="MdViewer" p="1">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </Box>
      )}
      </Box>
      </Flex>
    </Container>
  );
}
