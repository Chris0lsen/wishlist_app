import { type ListCollection, createListCollection } from '@chakra-ui/react';
import { useState } from 'react';
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
} from '~/components/ui/select';
import { useAuthStore } from '~/lib/stores/auth-store';
import type { GroupData, GroupSelectProps } from '../../types/types';
import { WishlistImportButton } from './wishlist-import-button';

export const GroupSelect: React.FC<GroupSelectProps> = ({ disabled }) => {
  const [groupData, setGroupData] = useState<GroupData>({});
  const [selectedGroup, setSelectedGroup] = useState<Array<string>>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  let groups: ListCollection;

  (async () => {
    if (!user) {
      setError('User is not authenticated.');
      return;
    }

    const userId = user.userId;
    if (!userId) {
      setError('User ID is not available.');
      return;
    }

    setError(null);

    try {
      const data = await get<GroupData>(`/groups/${userId}`);
      setGroupData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.',
      );
      return error;
    }
  })();

  if (Object.keys(groupData).length > 0) {
    const groupItems = Object.entries(groupData).map(
      ([itemId, itemDetails]) => ({
        label: itemDetails.name,
        value: itemId,
      }),
    );
    groups = createListCollection({
      items: Object.values(groupItems),
    });
  } else {
    groups = createListCollection({
      items: [],
    });
  }

  return (
    <SelectRoot
      width="33%"
      disabled={disabled}
      collection={groups}
      size="xs"
      value={selectedGroup}
      onValueChange={(e) => setSelectedGroup(e.value)}
    >
      <SelectTrigger>
        <SelectLabel>My Wishlists</SelectLabel>
      </SelectTrigger>
      <SelectContent>
        {groups.items.map((group) => (
          <SelectItem item={group} key={group.value}>
            {group.label}
          </SelectItem>
        ))}
        <WishlistImportButton disabled={!user?.steamId} />
      </SelectContent>
    </SelectRoot>
  );
};
