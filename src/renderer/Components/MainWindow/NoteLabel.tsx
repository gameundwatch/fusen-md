import { FileTextIcon, Pencil1Icon, PlusIcon, SunIcon, TrashIcon } from '@radix-ui/react-icons';
import { Card, Flex, Text, IconButton, Box } from "@radix-ui/themes";

export function NoteLabel() {

return (
<Card className="FusenCard" variant="surface" key={note.id}>
<Flex direction="row" align="center" justify="between">
  <Text size="2" weight="bold">
    {note.title}
  </Text>
  <Box>
    <Flex direction="row" align="center" gap="4">
      <Text size="1" color="gray">
        {/* {note.date} */"YYYY/MM/DD"}
      </Text>
      <IconButton
        variant="ghost"
        radius="full"
        onClick={() => {
            window.noteAPI.openNoteWindow(note.id);
        }}
        >
        <FileTextIcon scale="4" />
      </IconButton>
      <IconButton
        color="red"
        className="DeleteButton"
        variant="ghost"
        radius="full"
        onClick={() => deleteNote(note.id)}>
        <TrashIcon scale="4" />
      </IconButton>
    </Flex>
  </Box>
</Flex>
</Card>)
        }