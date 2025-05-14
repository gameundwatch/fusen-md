import path from 'path';
import fs from 'fs';
import { Note } from '../../common/note';

export async function renameNoteFile(
  note: Note,
  dir: string,
  newName: string,
): Promise<boolean> {
  const fileName = `${note.title}.md`;
  const newFileName = `${newName}.md`;
  const filePath = path.join(dir, fileName);
  const newPath = path.join(dir, newFileName);
  // force=true: 無い場合もエラーにしない
  await fs.promises.rename(filePath, newPath);
  console.log(`renamed: ${filePath} to ${newPath}`);
  return true;
}

export default renameNoteFile;
