import { atom } from 'jotai';

export interface Note {
  id: string;
  title: string;
  content: string;
}

// 必ずundefindを返すDummy用のAtom
export const dummyNoteAtom = atom<Note | undefined>(undefined);

// 全付箋を保持するメインatom
export const notesAtom = atom<Note[]>([
  { id: '1', title: 'サンプル付箋', content: '**Hello** from *Markdown*' },
  // 必要に応じて初期値を追加
]);

// 読み書き可能な derived atom
export const noteByIdAtom = (id: string) =>
  atom(
    (get) => {
      const notes = get(notesAtom);
      return notes.find((n) => n.id === id);
    },
    (get, set, update: Partial<Note>) => {
      // notesAtom の該当要素を更新
      const prev = get(notesAtom);
      set(
        notesAtom,
        prev.map((note) => (note.id === id ? { ...note, ...update } : note)),
      );
    },
  );
