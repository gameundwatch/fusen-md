import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import ReactMarkdown from 'react-markdown';

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function NoteEditor() {
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
    <div style={{ padding: 16 }}>
      {isActive ? (
        <textarea
          style={{ width: '100%', height: 100 }}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={saveContent} // 焦点が外れたら保存
        />
      ) : (
        <div style={{ backgroundColor: '#f0f0f0', marginTop: 8 }}>
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
