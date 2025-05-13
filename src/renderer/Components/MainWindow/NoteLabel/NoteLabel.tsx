import { FileTextIcon, TrashIcon } from '@radix-ui/react-icons';
import { Card, Flex, Text, IconButton, Box } from '@radix-ui/themes';
import { Note } from '../../../../common/note';

type NoteLabelProps = {
  note: Note;
  deleteNote: (title: string) => void;
};

export function NoteLabel(props: NoteLabelProps) {
  const { note, deleteNote } = props;
  return (
    <Card className="FusenCard" variant="surface" key={note.title}>
      <Flex direction="row" align="center" justify="between">
        <Text size="2" weight="bold">
          {note.title}
        </Text>
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
