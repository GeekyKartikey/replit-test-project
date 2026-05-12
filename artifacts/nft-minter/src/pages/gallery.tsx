import { useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, NFT_ABI } from "@/lib/contract";
import { motion } from "framer-motion";

export function Gallery() {
  const { data: totalMinted = 0n } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: "totalMinted",
  });

  const mintedCount = Number(totalMinted);
  
  // Show up to 12 most recent NFTs
  const displayCount = Math.min(mintedCount, 12);
  const items = Array.from({ length: displayCount }).map((_, i) => mintedCount - i);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tighter mb-2 text-white">Recent Mints</h1>
        <p className="text-white/60">The latest Genesis Passes minted on Monad.</p>
      </div>

      {mintedCount === 0 ? (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
          <p className="text-white/50 font-mono">No NFTs minted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((tokenId, index) => (
            <motion.div
              key={tokenId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-primary/50 transition-colors"
            >
              <div className="aspect-square bg-black relative">
                <img 
                  src="/nft-artwork.png" 
                  alt={`MonadNFT #${tokenId}`}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 800"><rect fill="%231a0b2e" width="800" height="800"/><text x="50%" y="50%" font-family="monospace" font-size="60" fill="%238B5CF6" text-anchor="middle" dominant-baseline="middle">NFT</text></svg>';
                  }}
                />
              </div>
              <div className="p-4 bg-background">
                <div className="text-xs text-white/50 font-mono mb-1">Monad Hacker Pass</div>
                <div className="font-mono text-white font-bold">#{tokenId}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
