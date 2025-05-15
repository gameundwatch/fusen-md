import { useState } from 'react';
import { Card, Flex, Text, Box, TextField } from '@radix-ui/themes';
import { Note } from '../../../../common/note';
import { NoteOptionMenu } from './NoteOptionMenu';

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
      {!edit ? (
        <Flex direction="row" align="center" justify="between">
          <Box>
            <Text
              size="2"
              weight="bold"
              onClick={() => {
                setEdit(true);
              }}
            >
              {note.title}
            </Text>
          </Box>
          <NoteOptionMenu note={note} edit={edit} deleteNote={deleteNote} />
        </Flex>
      ) : (
        <Flex direction="row" align="center" justify="between">
          <Box>
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
          </Box>
          <NoteOptionMenu note={note} edit={edit} deleteNote={deleteNote} />
        </Flex>
      )}
    </Card>
  );
}
export default NoteLabel;
