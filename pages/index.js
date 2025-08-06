import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Title, Text, Button, Group, Stack } from '@mantine/core';
import { IconUpload, IconMusic, IconPlayerPlay } from '@tabler/icons-react';
import AudioPlayer from '../components/AudioPlayer';
import AudioVisualizer from '../components/AudioVisualizer';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useLocalStorage } from '../hooks/useLocalStorage';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [tracks, setTracks] = useLocalStorage('neonbeats-tracks', []);
  const {
    currentTrack,
    isPlaying,
    progress,
    volume,
    playTrack,
    togglePlayPause,
    setVolume,
    seek
  } = useAudioPlayer();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newTracks = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name.replace('.mp3', ''),
      url: URL.createObjectURL(file),
      duration: 0,
      artist: 'Unknown Artist',
      file
    }));
    setTracks([...tracks, ...newTracks]);
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
          <LoadingSkeleton type="player" />
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
          {/* Hero Section */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <Title
                order={1}
                className="text-6xl md:text-8xl font-black mb-4 neon-text animate-glow"
                style={{
                  background: 'linear-gradient(45deg, #00ffff, #ff00ff, #ffff00)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                NEONBEATS
              </Title>
              <Text className="text-xl md:text-2xl text-cyber-primary opacity-80">
                Cyber Music Experience
              </Text>
            </motion.div>
          </div>

          {/* Audio Visualizer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-black/50 rounded-xl p-6 neon-border backdrop-blur-sm"
          >
            <AudioVisualizer isPlaying={isPlaying} />
          </motion.div>

          {/* Audio Player */}
          {currentTrack ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <AudioPlayer
                track={currentTrack}
                isPlaying={isPlaying}
                progress={progress}
                volume={volume}
                onPlayPause={togglePlayPause}
                onVolumeChange={setVolume}
                onSeek={seek}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center py-12"
            >
              <div className="bg-black/30 rounded-xl p-8 neon-border backdrop-blur-sm">
                <IconMusic size={64} className="mx-auto mb-4 text-cyber-primary opacity-60" />
                <Title order={3} className="mb-4 text-cyber-primary">
                  No Track Selected
                </Title>
                <Text className="mb-6 text-gray-400">
                  Upload some tracks to start your cyber music journey
                </Text>
                <input
                  type="file"
                  multiple
                  accept=".mp3,.wav,.ogg"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="audio-upload"
                />
                <label htmlFor="audio-upload">
                  <Button
                    component="span"
                    size="lg"
                    className="bg-gradient-to-r from-cyber-primary to-neon-pink hover:from-neon-pink hover:to-cyber-primary transition-all duration-300 neon-border"
                    leftSection={<IconUpload size={20} />}
                  >
                    Upload Music
                  </Button>
                </label>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          {tracks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-black/30 rounded-xl p-6 neon-border backdrop-blur-sm"
            >
              <Title order={4} className="mb-4 text-cyber-primary">
                Quick Play
              </Title>
              <Group>
                {tracks.slice(0, 3).map((track) => (
                  <Button
                    key={track.id}
                    variant="outline"
                    className="border-cyber-primary text-cyber-primary hover:bg-cyber-primary hover:text-black transition-all duration-300"
                    leftSection={<IconPlayerPlay size={16} />}
                    onClick={() => playTrack(track)}
                  >
                    {track.name}
                  </Button>
                ))}
              </Group>
            </motion.div>
          )}
        </Stack>
      </Container>
    </motion.div>
  );
}