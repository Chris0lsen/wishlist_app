import { Flex, Text } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Flex
      as="footer"
      width="full"
      align="center"
      alignSelf="flex-end"
      justifyContent="center"
    >
      <Text fontSize="xs">This is the footer</Text>
    </Flex>
  );
};
