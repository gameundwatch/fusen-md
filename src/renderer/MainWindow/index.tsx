// renderer/MainWindow.tsx (例)
import React, { useEffect, useState, JSX } from 'react';

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
    <div>
      <button type="button" onClick={addNote}>
        + 追加
      </button>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
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
          </li>
        ))}
      </ul>
    </div>
  );
}
