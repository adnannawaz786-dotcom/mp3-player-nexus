import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Group, Stack, Text, Button, Slider, Title } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause, IconPlayerSkipBack, IconPlayerSkipForward, IconVolume, IconVolumeOff } from '@tabler/icons-react';

export default function AudioPlayer({
  track,
  isPlaying,
  progress,
  volume,
  onPlayPause,
  onVolumeChange,
  onSeek
}) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!track) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-black/50 neon-border backdrop-blur-sm p-6">
        <Stack spacing="lg">
          {/* Track Info */}
          <div className="text-center">
            <Title order={3} className="text-cyber-primary mb-2 truncate">
              {track.name}
            </Title>
            <Text className="text-gray-400 truncate">
              {track.artist}
            </Text>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={progress.currentTime || 0}
              max={progress.duration || 100}
              onChange={onSeek}
              className="w-full"
              styles={{
                track: {
                  backgroundColor: 'rgba(0, 255, 255, 0.2)'
                },
                bar: {
                  background: 'linear-gradient(90deg, #00ffff, #ff00ff)'
                },
                thumb: {
                  backgroundColor: '#00ffff',
                  border: '2px solid #ff00ff',
                  boxShadow: '0 0 10px #00ffff'
                }
              }}
            />
            <Group justify="space-between" className="text-xs text-gray-400">
              <span>{formatTime(progress.currentTime)}</span>
              <span>{formatTime(progress.duration)}</span>
            </Group>
          </div>

          {/* Controls */}
          <Group justify="center" gap="xl">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="subtle"
                size="lg"
                className="text-cyber-primary hover:bg-cyber-primary/20"
              >
                <IconPlayerSkipBack size={24} />
              </Button>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.1 }}
            >
              <Button
                onClick={onPlayPause}
                size="xl"
                className={`rounded-full w-16 h-16 ${
                  isPlaying
                    ? 'bg-gradient-to-r from-neon-pink to-cyber-primary'
                    : 'bg-gradient-to-r from-cyber-primary to-neon-pink'
                } hover:shadow-neon transition-all duration-300`}
              >
                {isPlaying ? (
                  <IconPlayerPause size={28} className="text-black" />
                ) : (
                  <IconPlayerPlay size={28} className="text-black ml-1" />
                )}
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="subtle"
                size="lg"
                className="text-cyber-primary hover:bg-cyber-primary/20"
              >
                <IconPlayerSkipForward size={24} />
              </Button>
            </motion.div>
          </Group>

          {/* Volume Control */}
          <Group justify="center" className="relative">
            <motion.div
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setShowVolumeSlider(true)}
              onHoverEnd={() => setShowVolumeSlider(false)}
            >
              <Button
                variant="subtle"
                className="text-cyber-primary hover:bg-cyber-primary/20"
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              >
                {volume > 0 ? <IconVolume size={20} /> : <IconVolumeOff size={20} />}
              </Button>
            </motion.div>
            
            {showVolumeSlider && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute bottom-full mb-2 bg-black/90 rounded-lg p-2 neon-border"
              >
                <div className="w-20">
                  <Slider
                    value={volume * 100}
                    onChange={(value) => onVolumeChange(value / 100)}
                    min={0}
                    max={100}
                    styles={{
                      track: {
                        backgroundColor: 'rgba(0, 255, 255, 0.2)'
                      },
                      bar: {
                        background: 'linear-gradient(90deg, #00ffff, #ff00ff)'
                      },
                      thumb: {
                        backgroundColor: '#00ffff',
                        border: '2px solid #ff00ff',
                        boxShadow: '0 0 10px #00ffff'
                      }
                    }}
                  />
                </div>
              </motion.div>
            )}
          </Group>
        </Stack>
      </Card>
    </motion.div>
  );
}