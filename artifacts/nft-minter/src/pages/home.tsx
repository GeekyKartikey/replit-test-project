import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CONTRACT_ADDRESS, NFT_ABI } from "@/lib/contract";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink, Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function Home() {
  const { address, isConnected } = useAccount();

  // Read total minted
  const { data: totalMinted = 0n } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: "totalMinted",
    query: {
      refetchInterval: 5000,
    }
  });

  // Read max supply
  const { data: maxSupply = 1000n } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: "MAX_SUPPLY",
  });

  // Read user balance
  const { data: userBalance = 0n } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    }
  });

  // Write mint
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const isZeroAddress = CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000";

  const handleMint = () => {
    if (!address) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NFT_ABI,
      functionName: "mint",
      args: [address],
      value: parseEther("0.001"),
    });
  };

  const mintedStr = totalMinted.toString();
  const maxStr = maxSupply.toString();
  const progressPercent = Number(maxSupply) > 0 ? (Number(totalMinted) / Number(maxSupply)) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-5xl">
      {isZeroAddress && (
        <Alert className="mb-8 border-primary/50 bg-primary/10">
          <Zap className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary font-mono uppercase">Contract Not Deployed</AlertTitle>
          <AlertDescription className="text-primary/80">
            Fund the agent wallet to deploy the contract. Currently using a placeholder address.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5 neon-glow group"
        >
          <img 
            src="/nft-artwork.png" 
            alt="MonadNFT Artwork" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 800"><rect fill="%231a0b2e" width="800" height="800"/><path fill="%238B5CF6" opacity="0.3" d="M150 150h500v500H150z"/><text x="50%" y="50%" font-family="monospace" font-size="40" fill="%238B5CF6" text-anchor="middle" dominant-baseline="middle">MONAD NFT</text></svg>';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="font-mono text-primary text-sm font-bold uppercase tracking-widest mb-1">Genesis Collection</div>
            <div className="text-2xl font-bold text-white">Monad Hacker Pass</div>
          </div>
        </motion.div>

        {/* Right Column: Mint Details */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col space-y-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-white">
              Mint at the <span className="text-primary neon-text">Speed of Light</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              Experience the power of Monad. Instant finality, electric execution. Mint your Genesis Pass now and join the onchain revolution.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white/5 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-sm text-white/50 mb-1 font-medium">Mint Price</div>
                <div className="text-2xl font-mono text-white font-bold">0.001 MON</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/50 mb-1 font-medium">Supply</div>
                <div className="text-2xl font-mono text-white font-bold">{mintedStr} / {maxStr}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-primary">
                <span>Progress</span>
                <span>{progressPercent.toFixed(1)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2 bg-white/10" />
            </div>

            <div className="pt-4 border-t border-white/10">
              {!isConnected ? (
                <div className="flex justify-center">
                  <ConnectButton />
                </div>
              ) : (
                <Button 
                  onClick={handleMint} 
                  disabled={isPending || isConfirming || isZeroAddress}
                  className="w-full h-14 text-lg font-bold font-mono tracking-wider transition-all hover:neon-glow bg-primary hover:bg-primary/90 text-primary-foreground"
                  data-testid="button-mint"
                >
                  {isPending ? "MINTING..." : isConfirming ? "CONFIRMING..." : isSuccess ? "MINTED!" : "MINT NOW"}
                </Button>
              )}
            </div>
            
            {txHash && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-2"
              >
                <a 
                  href={`https://testnet.monadscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:text-white transition-colors"
                >
                  View on MonadScan <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>
            )}
          </div>

          {isConnected && (
            <div className="text-center text-sm font-mono text-white/50">
              You own <span className="text-primary font-bold">{userBalance.toString()}</span> NFTs from this collection.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
