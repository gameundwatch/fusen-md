import path from 'path';
import fs from 'fs';
import { Note } from '../../common/note';

export async function saveNoteFile(note: Note, dir: string): Promise<boolean> {
  // Notesディレクトリが存在しなければ作成
  await fs.mkdir(dir, { recursive: true }, () => {});

  // ファイル名を安全にする（ファイル名として使えない文字の除去）
  const safeTitle = note.title.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_');
  const filePath = path.join(dir, `${safeTitle}.md`);

  // Markdownファイルの内容
  const markdownContent = `${note.content}`;

  // ファイル書き込み
  await fs.writeFile(filePath, markdownContent, 'utf8', () => {});
  // 保存ログ
  console.log(`saved: ${filePath}`);
  return true;
}

export default saveNoteFile;
