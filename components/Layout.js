import { useRouter } from 'next/router';
import Link from 'next/link';
import { Container, Group, Text } from '@mantine/core';
import BottomNavigation from './BottomNavigation';

const navigation = [
  { name: 'Player', href: '/', icon: 'player' },
  { name: 'Library', href: '/library', icon: 'library' },
  { name: 'Playlists', href: '/playlists', icon: 'playlist' }
];

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-purple-900/20 to-cyber-dark cyber-grid">
      {/* Desktop Navigation */}
      <nav className="hidden md:block border-b border-cyber-primary/20 bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <Container size="lg">
          <Group justify="space-between" className="py-4">
            <Link href="/" className="text-2xl font-bold neon-text hover:animate-pulse transition-all duration-300">
              NEONBEATS
            </Link>
            <Group gap="xl">
              {navigation.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'text-cyber-primary neon-border bg-cyber-primary/10'
                        : 'text-gray-400 hover:text-cyber-primary hover:bg-cyber-primary/5'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyber-primary to-neon-pink" />
                    )}
                  </Link>
                );
              })}
            </Group>
          </Group>
        </Container>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-primary/20 bg-black/50 backdrop-blur-sm mt-auto">
        <Container size="lg">
          <div className="py-6 text-center">
            <Text className="text-sm text-gray-400">
              Made using{' '}
              <span className="text-cyber-primary font-semibold neon-text">
                PantheraBuilder
              </span>
            </Text>
          </div>
        </Container>
      </footer>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <BottomNavigation navigation={navigation} />
      </div>
    </div>
  );
}