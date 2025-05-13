import path from 'path';
import fs from 'fs';

import { Note } from '../../common/note';

export async function loadNoteFile(dir: string, file: string): Promise<Note> {
  const filePath = path.join(dir, file);
  const title = path.parse(file).name;
  const content = await fs.promises.readFile(filePath, 'utf8');
  return {
    title,
    content,
  };
}

export async function loadNotesFromDir(dir: string): Promise<Note[]> {
  // ディレクトリ確認、なければ作成
  await fs.promises.mkdir(dir, { recursive: true });

  const entries = await fs.promises.readdir(dir);
  const notes: Note[] = await Promise.all(
    entries
      .filter((file: string) => path.extname(file).toLowerCase() === '.md')
      .map((file: string) => {
        return loadNoteFile(dir, file);
      }),
  );

  return notes;
}
