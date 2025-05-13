import path from 'path';
import fs from 'fs';
import { Note } from '../../common/note';

export async function deleteNoteFile(
  note: Note,
  dir: string,
): Promise<boolean> {
  const fileName = `${note.title}.md`;
  const filePath = path.join(dir, fileName);
  console.log(`removed: ${filePath}`);
  // force=true: 無い場合もエラーにしない
  await fs.promises.rm(filePath, { force: true });
  return true;
}

export default deleteNoteFile;
