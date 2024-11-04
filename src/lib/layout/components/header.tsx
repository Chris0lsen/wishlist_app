// header.tsx

import { Flex, Spacer, createListCollection } from '@chakra-ui/react';
import { useState } from 'react';
import { SearchBar } from '~/components/search-bar';
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
} from '~/components/ui/select';

export const Header = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Array<string>>([
    'en',
  ]);

  const languages = createListCollection({
    items: [
      { label: 'EN', value: 'en' },
      { label: 'ES', value: 'es' },
    ],
  });

  return (
    <Flex direction="column" w="full">
      <Flex
        as="header"
        width="full"
        align="center"
        alignSelf="flex-start"
        justifyContent="center"
        gridGap={2}
      >
        <Spacer />
        <Flex direction="row" width="80%">
          <SearchBar />
        </Flex>
        <Flex marginLeft="auto">
          <SelectRoot
            collection={languages}
            size="sm"
            value={selectedLanguage}
            onValueChange={(e) => setSelectedLanguage(e.value)}
            multiple={false} // Ensure single selection mode
          >
            <SelectTrigger>
              <SelectLabel>Language</SelectLabel>
            </SelectTrigger>
            <SelectContent>
              {languages.items.map((language) => (
                <SelectItem item={language} key={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Flex>
      </Flex>
    </Flex>
  );
};
