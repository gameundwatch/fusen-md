import { useState } from 'react';
import { FileTextIcon, TrashIcon } from '@radix-ui/react-icons';
import { Card, Flex, Text, IconButton, Box, TextField } from '@radix-ui/themes';
import { Note } from '../../../../common/note';

type NoteLabelProps = {
  note: Note;
  renameNote: (title: string, newTitle: string) => void;
  deleteNote: (title: string) => void;
};

export function NoteLabel(props: NoteLabelProps) {
  const { note, renameNote, deleteNote } = props;
  const [edit, setEdit] = useState<boolean>(false);

  return (
    <Card className="FusenCard" variant="surface" key={note.title}>
      <Flex direction="row" align="center" justify="between">
        <Box>
          {!edit ? (
            <Text
              size="2"
              weight="bold"
              onClick={() => {
                setEdit(true);
              }}
            >
              {note.title}
            </Text>
          ) : (
            <TextField.Root
              className="TextField"
              size="1"
              variant="soft"
              defaultValue={note.title}
              onBlur={(e) => {
                if (e.target.value !== '') {
                  renameNote(note.title, e.target.value);
                }
                setEdit(false);
              }}
            />
          )}
        </Box>
        <Box>
          <Flex direction="row" align="center" gap="4">
            <Text size="1" color="gray">
              {/* {note.date} */ 'YYYY/MM/DD'}
            </Text>
            <IconButton
              variant="ghost"
              radius="full"
              onClick={() => {
                window.noteAPI.openNoteWindow(note.title);
              }}
            >
              <FileTextIcon scale="4" />
            </IconButton>
            <IconButton
              color="red"
              className="DeleteButton"
              variant="ghost"
              radius="full"
              onClick={() => deleteNote(note.title)}
            >
              <TrashIcon scale="4" />
            </IconButton>
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
}
export default NoteLabel;
