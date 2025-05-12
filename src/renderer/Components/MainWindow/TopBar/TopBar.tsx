import { Box, DropdownMenu, Flex } from '@radix-ui/themes';

import './index.css';
import { DropdownMenuFile } from './DropdownMenuFile';

type TopBarProps = {};

export function TopBar(props: TopBarProps) {
  return (
    <Box className="Top DragAnchor">
      <Flex direction="row" align="center" justify="between">
        <Box className="MenuContents">
          <Flex ml="2" direction="row" align="center" gap="4">
            {/* <DropdownMenu.Root>
              <DropdownMenuFile />
            </DropdownMenu.Root> */}
          </Flex>
        </Box>
        <Box className="WindowControls" />
      </Flex>
    </Box>
  );
}

export default TopBar;
