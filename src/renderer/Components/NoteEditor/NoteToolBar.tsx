import { Box, Flex, IconButton, Separator } from '@radix-ui/themes';
import {
  CheckboxIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeIcon,
  Cross1Icon,
  DotsHorizontalIcon,
  FontBoldIcon,
  FontItalicIcon,
  HeadingIcon,
  ListBulletIcon,
  QuoteIcon,
  StrikethroughIcon,
} from '@radix-ui/react-icons';

type NoteToolbarProps = {
  closeNote: () => void;
};

export function NoteToolbar(props: NoteToolbarProps) {
  const { closeNote } = props;
  return (
    <Box width="100%" className="Edit" px="2" py="1" flexGrow="0">
      <Flex width="100%" direction="row" align="center" justify="between">
        <Box flexGrow="1">
          <Flex direction="row" align="center" justify="start" gap="2">
            <IconButton type="button" variant="ghost" radius="small" size="1">
              <ChevronLeftIcon />
            </IconButton>
            <IconButton type="button" variant="ghost" radius="small" size="1">
              <ChevronRightIcon />
            </IconButton>
            <Separator orientation="vertical" size="1" />
            <IconButton type="button" variant="ghost" radius="small" size="1">
              <FontBoldIcon />
            </IconButton>
            <IconButton type="button" variant="ghost" radius="small" size="1">
              <FontItalicIcon />
            </IconButton>
            <IconButton type="button" variant="ghost" radius="small" size="1">
              <StrikethroughIcon />
            </IconButton>
            <IconButton type="button" variant="ghost" radius="small" size="1">
              <HeadingIcon />
            </IconButton>
            <Separator orientation="vertical" size="1" />
            <IconButton type="button" variant="ghost" radius="small" size="1">
              <CodeIcon />
            </IconButton>
            <IconButton type="button" variant="ghost" radius="small" size="1">
              <QuoteIcon />
            </IconButton>
            <IconButton type="button" variant="ghost" radius="small" size="1">
              <ListBulletIcon />
            </IconButton>
            <IconButton type="button" variant="ghost" radius="small" size="1">
              <CheckboxIcon />
            </IconButton>
            <IconButton type="button" variant="ghost" radius="small" size="1">
              <DotsHorizontalIcon />
            </IconButton>
          </Flex>
        </Box>
        <IconButton
          type="button"
          variant="ghost"
          radius="none"
          color="red"
          size="1"
          onClick={closeNote}
        >
          <Cross1Icon />
        </IconButton>
      </Flex>
    </Box>
  );
}

export default NoteToolbar;
