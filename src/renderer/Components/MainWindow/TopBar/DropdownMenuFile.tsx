import { ReaderIcon } from '@radix-ui/react-icons';
import { IconButton, DropdownMenu } from '@radix-ui/themes';

import './DropdownMenuFile.css';

export function DropdownMenuFile() {
  return (
    <>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" radius="none">
          <ReaderIcon />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="1">
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
  );
}

export default DropdownMenuFile;
