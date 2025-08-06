import { motion } from 'framer-motion';
import { Card, Group, Text, Button, Stack } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause, IconTrash, IconMusic } from '@tabler/icons-react';

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

export default function TrackList({
  tracks,
  currentTrack,
  isPlaying,
  onPlay,
  onDelete,
  showDelete = false
}) {
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      <Stack spacing="xs">
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isCurrentlyPlaying = isCurrentTrack && isPlaying;

          return (
            <motion.div
              key={track.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 ${
                  isCurrentTrack
                    ? 'bg-cyber-primary/10 neon-border shadow-neon'
                    : 'bg-black/30 border border-gray-700 hover:border-cyber-primary/50'
                } backdrop-blur-sm`}
                onClick={() => onPlay(track)}
              >
                <Group justify="space-between" className="w-full">
                  <Group className="flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyber-primary/20">
                      {isCurrentlyPlaying ? (
                        <IconPlayerPause 
                          size={20} 
                          className="text-cyber-primary animate-pulse" 
                        />
                      ) : (
                        <IconPlayerPlay 
                          size={20} 
                          className="text-cyber-primary" 
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Text 
                        className={`font-semibold truncate ${
                          isCurrentTrack ? 'text-cyber-primary' : 'text-white'
                        }`}
                      >
                        {track.name}
                      </Text>
                      <Text className="text-sm text-gray-400 truncate">
                        {track.artist}
                      </Text>
                    </div>
                  </Group>

                  <Group gap="sm" className="flex-shrink-0">
                    <Text className="text-xs text-gray-400 hidden sm:block">
                      {formatDuration(track.duration)}
                    </Text>
                    
                    {showDelete && (
                      <Button
                        variant="subtle"
                        size="xs"
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(track.id);
                        }}
                        className="hover:bg-red-500/20"
                      >
                        <IconTrash size={16} />
                      </Button>
                    )}
                  </Group>
                </Group>
              </Card>
            </motion.div>
          );
        })}
      </Stack>
    </motion.div>
  );
}