import { useState, useRef, useEffect, useCallback } from 'react';

export function useAudioPlayer() {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0 });
  const [volume, setVolume] = useState(1);
  
  // Update progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress({
        currentTime: audio.currentTime,
        duration: audio.duration || 0
      });
    };

    const handleLoadedMetadata = () => {
      setProgress(prev => ({
        ...prev,
        duration: audio.duration || 0
      }));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(prev => ({ ...prev, currentTime: 0 }));
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = useCallback((track) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setCurrentTrack(track);
    
    // Create new audio element
    const audio = new Audio(track.url);
    audio.volume = volume;
    audioRef.current = audio;
    
    // Play the track
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((error) => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    });
  }, [volume]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    }
  }, [isPlaying, currentTrack]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = time;
    setProgress(prev => ({ ...prev, currentTime: time }));
  }, []);

  const changeVolume = useCallback((newVolume) => {
    setVolume(newVolume);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    currentTrack,
    isPlaying,
    progress,
    volume,
    playTrack,
    togglePlayPause,
    seek,
    setVolume: changeVolume
  };
}