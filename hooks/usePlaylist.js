import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function usePlaylist() {
  const [playlists, setPlaylists] = useLocalStorage('neonbeats-playlists', []);

  const createPlaylist = useCallback((name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      tracks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  }, [setPlaylists]);

  const deletePlaylist = useCallback((playlistId) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
  }, [setPlaylists]);

  const updatePlaylist = useCallback((playlistId, updates) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { 
            ...playlist, 
            ...updates, 
            updatedAt: new Date().toISOString() 
          }
        : playlist
    ));
  }, [setPlaylists]);

  const addTrackToPlaylist = useCallback((playlistId, track) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        const trackExists = playlist.tracks.some(t => t.id === track.id);
        if (!trackExists) {
          return {
            ...playlist,
            tracks: [...playlist.tracks, track],
            updatedAt: new Date().toISOString()
          };
        }
      }
      return playlist;
    }));
  }, [setPlaylists]);

  const removeTrackFromPlaylist = useCallback((playlistId, trackId) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId
        ? {
            ...playlist,
            tracks: playlist.tracks.filter(track => track.id !== trackId),
            updatedAt: new Date().toISOString()
          }
        : playlist
    ));
  }, [setPlaylists]);

  const reorderPlaylistTracks = useCallback((playlistId, newTracks) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId
        ? {
            ...playlist,
            tracks: newTracks,
            updatedAt: new Date().toISOString()
          }
        : playlist
    ));
  }, [setPlaylists]);

  const getPlaylistById = useCallback((playlistId) => {
    return playlists.find(playlist => playlist.id === playlistId);
  }, [playlists]);

  const duplicatePlaylist = useCallback((playlistId, newName) => {
    const originalPlaylist = getPlaylistById(playlistId);
    if (!originalPlaylist) return null;

    const duplicatedPlaylist = {
      ...originalPlaylist,
      id: Date.now(),
      name: newName || `${originalPlaylist.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPlaylists(prev => [...prev, duplicatedPlaylist]);
    return duplicatedPlaylist;
  }, [getPlaylistById, setPlaylists]);

  return {
    playlists,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    reorderPlaylistTracks,
    getPlaylistById,
    duplicatePlaylist
  };
}