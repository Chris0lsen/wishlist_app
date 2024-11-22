import { createListCollection } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
} from '~/components/ui/select';
import { toaster } from '~/components/ui/toaster';
import { useAuthStore } from '~/lib/stores/auth-store';
import type { Group, User } from '~/lib/types/types';
import { get } from '~/lib/utils/api';
import type { GroupSelectProps } from '../../types/types';

export const GroupSelect: React.FC<GroupSelectProps> = ({ disabled }) => {
  const [selectedGroup, setSelectedGroup] = useState<Array<string>>([]);
  const [groups, setGroups] = useState(
    createListCollection({ items: new Array<Group>() }),
  );
  const { user } = useAuthStore();

  const { data: userData, error: fetchError } = useQuery({
    queryKey: ['wishlistsAndGroups', user?.userId],
    queryFn: () => fetchWishlistsAndGroups(user),

    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (fetchError) {
      toaster.create({
        description: `Error fetching wishlists: ${fetchError}`,
        type: 'error',
      });
    }
    if (userData) {
      setGroups(createListCollection({ items: userData.data }));
    }
  }, [fetchError, userData]);

  const fetchWishlistsAndGroups = async (user: User | null) => {
    return await get<{ data: Array<Group> }>(`/users/${user?.userId}/groups`);
  };

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
          <SelectItemGroup key={group.id} label={group.name}>
            {group.wishlists.map((wishlist) => (
              <SelectItem item={wishlist} key={wishlist.id}>
                {wishlist.name}
              </SelectItem>
            ))}
          </SelectItemGroup>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};
