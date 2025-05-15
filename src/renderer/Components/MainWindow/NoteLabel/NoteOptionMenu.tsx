import { FileTextIcon, TrashIcon } from '@radix-ui/react-icons';
import { Flex, Text, IconButton, Box } from '@radix-ui/themes';
import { Note } from '../../../../common/note';

type NoteOptionMenuProps = {
  note: Note;
  edit: boolean;
  deleteNote: (title: string) => void;
};

export function NoteOptionMenu(props: NoteOptionMenuProps) {
  const { note, edit, deleteNote } = props;

  return (
    <Box>
      <Flex direction="row" align="center" gap="4">
        <IconButton
          disabled={edit}
          className="colorPicker"
          color="amber"
          variant="solid"
          size="1"
        />
        <IconButton
          disabled={edit}
          variant="ghost"
          radius="full"
          onClick={() => {
            window.noteAPI.openNoteWindow(note.title);
          }}
        >
          <FileTextIcon scale="4" />
        </IconButton>
        <IconButton
          disabled={edit}
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
  );
}
export default NoteOptionMenuProps;
