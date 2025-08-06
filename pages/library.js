import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Title, Text, Button, TextInput, Group, Stack, Card } from '@mantine/core';
import { IconSearch, IconUpload, IconTrash, IconPlayerPlay, IconMusic } from '@tabler/icons-react';
import TrackList from '../components/TrackList';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

export default function Library() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tracks, setTracks] = useLocalStorage('neonbeats-tracks', []);
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newTracks = files.map((file, index) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      
      return {
        id: Date.now() + index,
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: URL.createObjectURL(file),
        duration: 0,
        artist: 'Unknown Artist',
        file,
        dateAdded: new Date().toISOString()
      };
    });
    setTracks([...tracks, ...newTracks]);
  };

  const handleDeleteTrack = (trackId) => {
    setTracks(tracks.filter(track => track.id !== trackId));
  };

  const filteredTracks = tracks.filter(track =>
    track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <LoadingSkeleton type="library" />
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
                background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              MUSIC LIBRARY
            </Title>
            <Text className="text-lg text-gray-400">
              Manage your cyber music collection
            </Text>
          </motion.div>

          {/* Search and Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-black/30 rounded-xl p-6 neon-border backdrop-blur-sm"
          >
            <Group className="mb-4">
              <TextInput
                placeholder="Search tracks or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftSection={<IconSearch size={20} />}
                className="flex-1"
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
              <input
                type="file"
                multiple
                accept=".mp3,.wav,.ogg"
                onChange={handleFileUpload}
                className="hidden"
                id="library-upload"
              />
              <label htmlFor="library-upload">
                <Button
                  component="span"
                  className="bg-gradient-to-r from-cyber-primary to-neon-pink hover:from-neon-pink hover:to-cyber-primary transition-all duration-300"
                  leftSection={<IconUpload size={20} />}
                >
                  Upload
                </Button>
              </label>
            </Group>
            
            <Text className="text-sm text-gray-400">
              {tracks.length} tracks in library • {filteredTracks.length} shown
            </Text>
          </motion.div>

          {/* Track List */}
          {filteredTracks.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <TrackList
                tracks={filteredTracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlay={playTrack}
                onDelete={handleDeleteTrack}
                showDelete
              />
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
                  {searchQuery ? 'No Matching Tracks' : 'Your Library is Empty'}
                </Title>
                <Text className="mb-6 text-gray-400">
                  {searchQuery 
                    ? `No tracks found matching "${searchQuery}"`
                    : 'Upload some tracks to build your cyber music collection'
                  }
                </Text>
                {!searchQuery && (
                  <input
                    type="file"
                    multiple
                    accept=".mp3,.wav,.ogg"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="empty-upload"
                  />
                )}
                {!searchQuery && (
                  <label htmlFor="empty-upload">
                    <Button
                      component="span"
                      size="lg"
                      className="bg-gradient-to-r from-cyber-primary to-neon-pink hover:from-neon-pink hover:to-cyber-primary transition-all duration-300"
                      leftSection={<IconUpload size={20} />}
                    >
                      Upload Your First Track
                    </Button>
                  </label>
                )}
              </Card>
            </motion.div>
          )}
        </Stack>
      </Container>
    </motion.div>
  );
}