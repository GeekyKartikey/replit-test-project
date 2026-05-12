import { Link } from "wouter";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Zap } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans dark text-foreground bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto h-16 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white group">
            <Zap className="w-5 h-5 text-primary group-hover:neon-text transition-all" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">MonadNFT</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Mint
            </Link>
            <Link href="/gallery" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Gallery
            </Link>
            <div className="ml-4">
              <ConnectButton 
                chainStatus="icon" 
                showBalance={false} 
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
              />
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t border-white/10 py-8 text-center text-white/50 text-xs font-mono">
        <p>Built on Monad Testnet.</p>
        <p className="mt-1">10,000 TPS. 400ms blocks. Speed of light.</p>
      </footer>
    </div>
  );
}
