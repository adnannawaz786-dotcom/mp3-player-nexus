import { motion } from 'framer-motion';
import { Card, Stack, Group } from '@mantine/core';

const shimmerVariants = {
  initial: { x: '-100%' },
  animate: { x: '100%' },
};

const SkeletonBar = ({ width = '100%', height = '1rem' }) => (
  <div
    className="relative overflow-hidden rounded bg-gray-800"
    style={{ width, height }}
  >
    <motion.div
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-primary/20 to-transparent"
    />
  </div>
);

const PlayerSkeleton = () => (
  <Stack spacing="xl">
    {/* Hero Section */}
    <div className="text-center">
      <SkeletonBar width="300px" height="4rem" />
      <div className="mt-4">
        <SkeletonBar width="200px" height="1.5rem" />
      </div>
    </div>

    {/* Visualizer */}
    <Card className="bg-black/30 neon-border p-6">
      <SkeletonBar height="12rem" />
    </Card>

    {/* Player Controls */}
    <Card className="bg-black/30 neon-border p-6">
      <Stack spacing="lg">
        <div className="text-center">
          <SkeletonBar width="200px" height="1.5rem" />
          <div className="mt-2">
            <SkeletonBar width="150px" height="1rem" />
          </div>
        </div>
        <SkeletonBar height="0.5rem" />
        <Group justify="center" gap="xl">
          <SkeletonBar width="3rem" height="3rem" />
          <SkeletonBar width="4rem" height="4rem" />
          <SkeletonBar width="3rem" height="3rem" />
        </Group>
      </Stack>
    </Card>
  </Stack>
);

const LibrarySkeleton = () => (
  <Stack spacing="xl">
    {/* Header */}
    <div className="text-center">
      <SkeletonBar width="250px" height="3rem" />
      <div className="mt-4">
        <SkeletonBar width="180px" height="1rem" />
      </div>
    </div>

    {/* Search Bar */}
    <Card className="bg-black/30 neon-border p-6">
      <Group className="mb-4">
        <SkeletonBar width="70%" height="2.5rem" />
        <SkeletonBar width="6rem" height="2.5rem" />
      </Group>
      <SkeletonBar width="120px" height="0.75rem" />
    </Card>

    {/* Track List */}
    <Stack spacing="xs">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-black/30 border border-gray-700 p-4">
            <Group justify="space-between">
              <Group>
                <SkeletonBar width="2.5rem" height="2.5rem" />
                <div>
                  <SkeletonBar width="150px" height="1rem" />
                  <div className="mt-2">
                    <SkeletonBar width="100px" height="0.75rem" />
                  </div>
                </div>
              </Group>
              <Group gap="sm">
                <SkeletonBar width="3rem" height="0.75rem" />
                <SkeletonBar width="2rem" height="2rem" />
              </Group>
            </Group>
          </Card>
        </motion.div>
      ))}
    </Stack>
  </Stack>
);

const PlaylistsSkeleton = () => (
  <Stack spacing="xl">
    {/* Header */}
    <div className="text-center">
      <SkeletonBar width="200px" height="3rem" />
      <div className="mt-4">
        <SkeletonBar width="220px" height="1rem" />
      </div>
    </div>

    {/* Controls */}
    <Card className="bg-black/30 neon-border p-6">
      <Group justify="space-between">
        <div>
          <SkeletonBar width="120px" height="1.5rem" />
          <div className="mt-2">
            <SkeletonBar width="80px" height="0.75rem" />
          </div>
        </div>
        <SkeletonBar width="8rem" height="2.5rem" />
      </Group>
    </Card>

    {/* Playlists Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-black/30 border border-gray-700 p-6">
            <Group justify="space-between" className="mb-4">
              <SkeletonBar width="2rem" height="2rem" />
              <SkeletonBar width="1.5rem" height="1.5rem" />
            </Group>
            <SkeletonBar width="80%" height="1.5rem" />
            <div className="mt-2">
              <SkeletonBar width="60px" height="0.75rem" />
            </div>
            <div className="mt-4">
              <SkeletonBar width="100px" height="0.5rem" />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  </Stack>
);

export default function LoadingSkeleton({ type = 'player' }) {
  const skeletonComponents = {
    player: PlayerSkeleton,
    library: LibrarySkeleton,
    playlists: PlaylistsSkeleton
  };

  const SkeletonComponent = skeletonComponents[type] || PlayerSkeleton;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-nav"
    >
      <SkeletonComponent />
    </motion.div>
  );
}