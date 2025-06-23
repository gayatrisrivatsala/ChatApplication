import { CloseIcon } from '@chakra-ui/icons';
import { Badge ,Box } from '@chakra-ui/layout';
import React from 'react'

const UserBadgeItem = ({user ,handleFunction}) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      w="auto"
      variant="solid"
      fontSize={12}
      backgroundColor="#00004d"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
    >
        {user.name}
        <CloseIcon pl={1}/>
    </Badge>
  );
}

export default UserBadgeItem
