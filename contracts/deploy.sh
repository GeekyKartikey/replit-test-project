#!/bin/bash
# Deploy MonadNFT to Monad Testnet
# Run this after funding the agent wallet at: https://faucet.monad.xyz
# Agent wallet: 0xBAC3D6e62bc83998883F8F1905C7feEf7379Eec7

set -e

KEYSTORE_DIR="$HOME/.monskills/keystore"
KEYSTORE_FILE=$(ls "$KEYSTORE_DIR" | head -1)

echo "Decrypting agent wallet..."
PRIVATE_KEY=$(cast wallet decrypt-keystore --keystore-dir "$KEYSTORE_DIR" "$KEYSTORE_FILE" --unsafe-password "" | awk '{print $NF}')

echo "Deploying MonadNFT to Monad Testnet..."
cd "$(dirname "$0")"

forge script script/Deploy.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key "$PRIVATE_KEY" \
  --broadcast \
  --chain 10143

echo ""
echo "Deployment complete! Copy the contract address above and set it in:"
echo "  artifacts/nft-minter/.env  →  VITE_CONTRACT_ADDRESS=0x..."
echo "Then restart the nft-minter workflow."
