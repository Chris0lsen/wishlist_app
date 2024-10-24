import { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useAuth } from '~/lib/context/use-auth';

interface WishlistItem {
  name: string;
  price: number;
}

interface WishlistImportButtonProps {
  disabled: boolean;
}

export const WishlistImportButton: React.FC<WishlistImportButtonProps> = ({ disabled }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Controls the modal visibility
  const { state } = useAuth(); // Access the steamId from context
  const [wishlistData, setWishlistData] = useState<Array<WishlistItem>>([]); // State to store wishlist data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle the click event and show the import modal
  const handleShowImportModal = async () => {
    if (!state.steamId) {
      setError('Steam ID is not available.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://192.168.68.90:4000/api/wishlist?steam_id=${state.steamId}&cc=en`,
      );

      if (!response.ok) {
        throw new Error(`Error fetching wishlist: ${response.statusText}`);
      }

      const data = await response.json();
      setWishlistData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.',
      );
    } finally {
      setIsLoading(false);
      onOpen(); // Open the modal after the data is fetched or if there's an error
    }
  };

  return (
    <>
      <Button
        colorScheme="blue"
        disabled={disabled}
        onClick={handleShowImportModal}
      >
        Import Wishlist
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import Wishlist</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoading ? (
              <Spinner size="lg" />
            ) : error ? (
              <Text color="red.500">{error}</Text>
            ) : (
              <div>
                {Object.keys(wishlistData).length > 0 ? (
                  <ul>
                    {Object.entries(wishlistData).map(
                      ([itemId, itemDetails]) => (
                        <li key={itemId}>
                          <Text fontWeight="bold">{itemDetails.name}</Text>
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <Text>No wishlist items found.</Text>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
