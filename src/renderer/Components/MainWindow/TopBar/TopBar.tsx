import { PlusIcon } from '@radix-ui/react-icons';
import { Box, DropdownMenu, Flex, Heading, IconButton } from '@radix-ui/themes';

import './index.css';
import { DropdownMenuFile } from './DropdownMenuFile';

type TopBarProps = {
  addNote: () => void;
};

export function TopBar(props: TopBarProps) {
  const { addNote } = props;
  return (
    <Box className="Top DragAnchor" height="32px" maxHeight="32px">
      <Flex direction="row" align="center" justify="between">
        <Box className="MenuContents">
          <Flex ml="2" direction="row" align="center" gap="4">
            <Heading size="4">Fusen</Heading>
            <IconButton variant="ghost" onClick={addNote}>
              <PlusIcon />
            </IconButton>
            <DropdownMenu.Root>
              <DropdownMenuFile />
            </DropdownMenu.Root>
          </Flex>
        </Box>
        <Box className="WindowControls" />
      </Flex>
    </Box>
  );
}

export default TopBar;
