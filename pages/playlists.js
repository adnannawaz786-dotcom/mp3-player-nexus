import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Title, Text, Button, TextInput, Group, Stack, Card, Modal } from '@mantine/core';
import { IconPlus, IconMusic, IconTrash, IconEdit } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import PlaylistManager from '../components/PlaylistManager';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePlaylist } from '../hooks/usePlaylist';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

export default function Playlists() {
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [tracks] = useLocalStorage('neonbeats-tracks', []);
  const {
    playlists,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    reorderPlaylistTracks
  } = usePlaylist();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setModalOpened(false);
      notifications.show({
        title: 'Playlist Created',
        message: `"${newPlaylistName}" has been created successfully`,
        color: 'cyan'
      });
    }
  };

  const handleDeletePlaylist = (playlistId, playlistName) => {
    deletePlaylist(playlistId);
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
    }
    notifications.show({
      title: 'Playlist Deleted',
      message: `"${playlistName}" has been deleted`,
      color: 'red'
    });
  };

  if (isLoading) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen"
      >
        <Container size="lg" className="py-8">
          <LoadingSkeleton type="playlists" />
        </Container>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen pb-nav"
    >
      <Container size="lg" className="py-8">
        <Stack spacing="xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <Title
              order={1}
              className="text-4xl md:text-6xl font-bold mb-4 neon-text"
              style={{
                background: 'linear-gradient(45deg, #ff00ff, #ffff00)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              PLAYLISTS
            </Title>
            <Text className="text-lg text-gray-400">
              Create and manage your cyber music collections
            </Text>
          </motion.div>

          {/* Create Playlist Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-between items-center bg-black/30 rounded-xl p-6 neon-border backdrop-blur-sm"
          >
            <div>
              <Title order={4} className="text-cyber-primary mb-2">
                Your Playlists
              </Title>
              <Text className="text-sm text-gray-400">
                {playlists.length} playlists created
              </Text>
            </div>
            <Button
              onClick={() => setModalOpened(true)}
              className="bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink transition-all duration-300"
              leftSection={<IconPlus size={20} />}
            >
              New Playlist
            </Button>
          </motion.div>

          {/* Playlists Grid */}
          {playlists.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {playlists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedPlaylist(playlist)}
                >
                  <Card className="bg-black/40 neon-border backdrop-blur-sm hover:shadow-neon-pink transition-all duration-300 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <IconMusic size={32} className="text-cyber-primary" />
                      <Button
                        variant="subtle"
                        size="xs"
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlaylist(playlist.id, playlist.name);
                        }}
                      >
                        <IconTrash size={16} />
                      </Button>
                    </div>
                    <Title order={4} className="text-cyber-primary mb-2 truncate">
                      {playlist.name}
                    </Title>
                    <Text className="text-sm text-gray-400 mb-4">
                      {playlist.tracks.length} tracks
                    </Text>
                    <Text className="text-xs text-gray-500">
                      Created {new Date(playlist.createdAt).toLocaleDateString()}
                    </Text>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center py-12"
            >
              <Card className="bg-black/30 neon-border backdrop-blur-sm p-8">
                <IconMusic size={64} className="mx-auto mb-4 text-cyber-primary opacity-60" />
                <Title order={3} className="mb-4 text-cyber-primary">
                  No Playlists Yet
                </Title>
                <Text className="mb-6 text-gray-400">
                  Create your first playlist to organize your cyber beats
                </Text>
                <Button
                  size="lg"
                  onClick={() => setModalOpened(true)}
                  className="bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-purple hover:to-neon-pink transition-all duration-300"
                  leftSection={<IconPlus size={20} />}
                >
                  Create First Playlist
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Playlist Manager */}
          {selectedPlaylist && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <PlaylistManager
                playlist={selectedPlaylist}
                availableTracks={tracks}
                onAddTrack={addTrackToPlaylist}
                onRemoveTrack={removeTrackFromPlaylist}
                onReorderTracks={reorderPlaylistTracks}
                onClose={() => setSelectedPlaylist(null)}
              />
            </motion.div>
          )}
        </Stack>
      </Container>

      {/* Create Playlist Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Create New Playlist"
        centered
        styles={{
          content: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid #00ffff'
          },
          header: {
            backgroundColor: 'transparent',
            borderBottom: '1px solid #00ffff'
          },
          title: {
            color: '#00ffff',
            fontWeight: 'bold'
          }
        }}
      >
        <Stack>
          <TextInput
            placeholder="Enter playlist name..."
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
            styles={{
              input: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid #00ffff',
                color: '#00ffff',
                '&:focus': {
                  borderColor: '#ff00ff',
                  boxShadow: '0 0 10px #ff00ff'
                }
              }
            }}
          />
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setModalOpened(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreatePlaylist}
              disabled={!newPlaylistName.trim()}
              className="bg-gradient-to-r from-cyber-primary to-neon-pink hover:from-neon-pink hover:to-cyber-primary"
            >
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>
    </motion.div>
  );
}