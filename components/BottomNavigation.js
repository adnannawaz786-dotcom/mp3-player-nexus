import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconPlayerPlay, IconMusic, IconPlaylist } from '@tabler/icons-react';

const iconMap = {
  player: IconPlayerPlay,
  library: IconMusic,
  playlist: IconPlaylist
};

export default function BottomNavigation({ navigation }) {
  const router = useRouter();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-cyber-primary/30 z-50"
    >
      <div className="grid grid-cols-3 h-16">
        {navigation.map((item, index) => {
          const isActive = router.pathname === item.href;
          const Icon = iconMap[item.icon];
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center relative transition-all duration-300 ${
                isActive
                  ? 'text-cyber-primary'
                  : 'text-gray-400 hover:text-cyber-primary'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center"
              >
                <Icon 
                  size={24} 
                  className={`mb-1 ${isActive ? 'animate-pulse' : ''}`} 
                />
                <span className="text-xs font-medium">
                  {item.name}
                </span>
              </motion.div>
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 w-12 h-1 bg-gradient-to-r from-cyber-primary to-neon-pink rounded-b-full"
                  style={{ x: '-50%' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}