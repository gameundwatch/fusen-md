import { DotIcon, GearIcon, ReaderIcon, SunIcon } from "@radix-ui/react-icons";
import { Box, Button, DropdownMenu, Flex, IconButton } from "@radix-ui/themes";

import "./index.css"

function MenuFile() {
  return (
        <>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" radius="none" size="1">
              <ReaderIcon />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content size={"1"}>
            <DropdownMenu.Item shortcut="⌘ N">New Fusen</DropdownMenu.Item>
            <DropdownMenu.Item shortcut="⌘ D">Open File....</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Export</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>Preferences</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item>Themes</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
            <DropdownMenu.Separator />
            <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
              Exit
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </>
  )
}

export function TopBar() {
    return(      
  <Box className="Top DragAnchor">
    <Flex direction="row" align="center" justify="between">
    <Box className='MenuContents'>
      <Flex ml="2" direction="row" align="center" gap="4">
        <DropdownMenu.Root>
          <MenuFile />
        </DropdownMenu.Root>
      </Flex>
    </Box>
    <Box className="WindowControls"></Box>
    </Flex>
  </Box>
)
}