import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Group, Text, Button, Stack, Title, TextInput, ScrollArea } from '@mantine/core';
import { IconX, IconPlus, IconTrash, IconSearch, IconMusic, IconGripVertical } from '@tabler/icons-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function PlaylistManager({
  playlist,
  availableTracks,
  onAddTrack,
  onRemoveTrack,
  onReorderTracks,
  onClose
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTracks, setShowAddTracks] = useState(false);

  const filteredAvailableTracks = availableTracks.filter(
    track => 
      !playlist.tracks.some(pTrack => pTrack.id === track.id) &&
      (track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       track.artist.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(playlist.tracks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorderTracks(playlist.id, items);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        exit={{ y: 50 }}
        className="w-full max-w-4xl max-h-[90vh] bg-black/90 rounded-xl neon-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-cyber-primary/30">
          <Group justify="space-between">
            <div>
              <Title order={2} className="text-cyber-primary mb-2">
                {playlist.name}
              </Title>
              <Text className="text-gray-400">
                {playlist.tracks.length} tracks
              </Text>
            </div>
            <Group>
              <Button
                onClick={() => setShowAddTracks(!showAddTracks)}
                className="bg-gradient-to-r from-neon-green to-cyber-primary hover:from-cyber-primary hover:to-neon-green"
                leftSection={<IconPlus size={16} />}
              >
                Add Tracks
              </Button>
              <Button
                variant="subtle"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <IconX size={20} />
              </Button>
            </Group>
          </Group>
        </div>

        <div className="flex flex-col lg:flex-row h-[60vh]">
          {/* Playlist Tracks */}
          <div className="flex-1 p-6">
            <Title order={4} className="text-cyber-primary mb-4">
              Playlist Tracks
            </Title>
            
            {playlist.tracks.length > 0 ? (
              <ScrollArea className="h-full">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="playlist">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {playlist.tracks.map((track, index) => (
                          <Draggable key={track.id} draggableId={track.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <motion.div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                layout
                                className={`mb-2 ${snapshot.isDragging ? 'z-50' : ''}`}
                              >
                                <Card className={`transition-all duration-200 ${
                                  snapshot.isDragging 
                                    ? 'shadow-neon rotate-2 scale-105' 
                                    : 'bg-black/40 hover:bg-black/60'
                                } neon-border`}>
                                  <Group justify="space-between">
                                    <Group>
                                      <div 
                                        {...provided.dragHandleProps}
                                        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-cyber-primary"
                                      >
                                        <IconGripVertical size={16} />
                                      </div>
                                      <div>
                                        <Text className="text-white font-medium">
                                          {track.name}
                                        </Text>
                                        <Text className="text-sm text-gray-400">
                                          {track.artist}
                                        </Text>
                                      </div>
                                    </Group>
                                    <Button
                                      variant="subtle"
                                      size="xs"
                                      color="red"
                                      onClick={() => onRemoveTrack(playlist.id, track.id)}
                                    >
                                      <IconTrash size={16} />
                                    </Button>
                                  </Group>
                                </Card>
                              </motion.div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </ScrollArea>
            ) : (
              <div className="text-center py-12">
                <IconMusic size={48} className="mx-auto mb-4 text-gray-600" />
                <Text className="text-gray-400">
                  No tracks in this playlist yet
                </Text>
              </div>
            )}
          </div>

          {/* Add Tracks Panel */}
          <AnimatePresence>
            {showAddTracks && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '50%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-cyber-primary/30 bg-black/20"
              >
                <div className="p-6 h-full flex flex-col">
                  <Title order={4} className="text-neon-pink mb-4">
                    Add Tracks
                  </Title>
                  
                  <TextInput
                    placeholder="Search tracks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftSection={<IconSearch size={16} />}
                    className="mb-4"
                    styles={{
                      input: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid #00ffff',
                        color: '#00ffff'
                      }
                    }}
                  />

                  <ScrollArea className="flex-1">
                    <Stack spacing="xs">
                      {filteredAvailableTracks.map((track) => (
                        <motion.div
                          key={track.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className="cursor-pointer bg-black/40 hover:bg-black/60 border border-gray-700 hover:border-neon-pink/50 transition-all duration-200"
                            onClick={() => onAddTrack(playlist.id, track)}
                          >
                            <Group justify="space-between">
                              <div className="flex-1 min-w-0">
                                <Text className="text-white font-medium truncate">
                                  {track.name}
                                </Text>
                                <Text className="text-sm text-gray-400 truncate">
                                  {track.artist}
                                </Text>
                              </div>
                              <IconPlus size={16} className="text-neon-pink" />
                            </Group>
                          </Card>
                        </motion.div>
                      ))}
                    </Stack>
                    
                    {filteredAvailableTracks.length === 0 && (
                      <div className="text-center py-8">
                        <Text className="text-gray-400">
                          {searchQuery ? 'No matching tracks found' : 'All tracks are already in this playlist'}
                        </Text>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}