import { SunIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex } from "@radix-ui/themes";

export function TopBar() {
    return(      
    <Box className="Top DragAnchor">
        <Flex direction="row" align="center" justify="between">
          <Box className='MenuContents'>
            <Flex ml="2" direction="row" align="center" gap="4">
              <SunIcon color="violet"/>
              <Button variant="ghost">File</Button>
              <Button variant="ghost">Edit</Button>
              <Button variant="ghost">List</Button>
            </Flex>
          </Box>
          <Box className="WindowControls"></Box>
        </Flex>
      </Box>
)
}