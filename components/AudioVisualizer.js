import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function AudioVisualizer({ isPlaying }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const barsRef = useRef([]);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const barCount = 64;
    const barWidth = canvas.width / barCount;
    
    // Initialize bars with random heights for demo
    if (barsRef.current.length === 0) {
      barsRef.current = Array.from({ length: barCount }, () => Math.random() * 0.5 + 0.1);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, '#ff00ff');
      gradient.addColorStop(0.5, '#00ffff');
      gradient.addColorStop(1, '#ffff00');
      
      ctx.fillStyle = gradient;
      
      // Draw bars
      barsRef.current.forEach((height, index) => {
        const barHeight = height * canvas.height;
        const x = index * barWidth;
        const y = canvas.height - barHeight;
        
        // Add some glow effect
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        
        ctx.fillRect(x, y, barWidth - 2, barHeight);
        
        // Animate bars
        if (isPlaying) {
          barsRef.current[index] = Math.max(0.1, height + (Math.random() - 0.5) * 0.1);
          if (barsRef.current[index] > 1) barsRef.current[index] = 1;
        } else {
          barsRef.current[index] = Math.max(0.1, height * 0.95);
        }
      });
      
      ctx.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full h-32 md:h-48 rounded-lg overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-gradient-to-r from-black/50 via-purple-900/20 to-black/50"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none" />
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: isPlaying ? [1, 1.1, 1] : 1,
            opacity: isPlaying ? [0.7, 1, 0.7] : 0.5
          }}
          transition={{
            duration: 2,
            repeat: isPlaying ? Infinity : 0,
            ease: 'easeInOut'
          }}
          className="text-center"
        >
          <div className="text-2xl md:text-4xl font-bold text-cyber-primary neon-text">
            {isPlaying ? 'NOW PLAYING' : 'AUDIO VISUALIZER'}
          </div>
          <div className="text-sm md:text-base text-gray-400 mt-2">
            {isPlaying ? 'Cyber frequencies active' : 'Waiting for signal...'}
          </div>
        </motion.div>
      </div>
      
      {/* Pulse effect when playing */}
      {isPlaying && (
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-0 border-2 border-cyber-primary rounded-lg"
        />
      )}
    </motion.div>
  );
}