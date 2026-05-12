# Monad NFT Minter

An NFT minting dApp on Monad Testnet — ERC721 smart contract (OpenZeppelin) + React/Vite frontend with RainbowKit wallet connection.

## Run & Operate

- `pnpm --filter @workspace/nft-minter run dev` — run the frontend (uses PORT env var)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `bash contracts/deploy.sh` — deploy MonadNFT to Monad testnet (requires funded wallet)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, shadcn/ui
- Wallet: RainbowKit + Wagmi + viem
- Smart contracts: Solidity 0.8.28, Foundry, OpenZeppelin ERC721
- Chain: Monad Testnet (chainId 10143, RPC: https://testnet-rpc.monad.xyz)
- API: Express 5 (minimal — most logic is onchain)

## Where things live

- `contracts/src/MonadNFT.sol` — ERC721 contract (max supply 1000, 0.001 MON mint price)
- `contracts/script/Deploy.s.sol` — Foundry deploy script
- `contracts/deploy.sh` — deploy helper script
- `artifacts/nft-minter/src/lib/contract.ts` — ABI + contract address config
- `artifacts/nft-minter/src/` — React frontend
- `lib/api-spec/openapi.yaml` — API contract (health check only)

## Deploying the Smart Contract

1. Fund the agent wallet with test MON from https://faucet.monad.xyz
   - Agent wallet address: `0xBAC3D6e62bc83998883F8F1905C7feEf7379Eec7`
2. Run `bash contracts/deploy.sh`
3. Copy the deployed contract address
4. Set `VITE_CONTRACT_ADDRESS=0x...` in `artifacts/nft-minter/.env`
5. Restart the nft-minter workflow

## After Deployment — Verify the Contract

```bash
cd contracts
# Get verification data
forge verify-contract <ADDR> src/MonadNFT.sol:MonadNFT \
  --chain 10143 \
  --show-standard-json-input > /tmp/standard-input.json
cat out/MonadNFT.sol/MonadNFT.json | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['metadata'])" > /tmp/metadata.json

# Call verification API (verifies on all 3 Monad explorers)
curl -X POST https://agents.devnads.com/v1/verify \
  -H "Content-Type: application/json" \
  -d @/tmp/verify.json
```

## Architecture decisions

- No backend for core minting — all state lives onchain (Monad is fast enough)
- Agent wallet (encrypted keystore at `~/.monskills/keystore`) owns the deployed contract
- Contract address injected via `VITE_CONTRACT_ADDRESS` env var for easy network switching
- Wagmi v3 + RainbowKit for wallet UX — natively supports Monad chains
- tsconfig target bumped to ES2020 for viem/wagmi BigInt literal compatibility

## Product

Users can connect their wallet, see live mint stats (minted / 1000 supply), mint NFTs for 0.001 MON each, and view their owned NFT collection. Transactions confirm in ~400ms on Monad.

## User preferences

_Populate as you build._

## Gotchas

- Always fund the agent wallet before running `deploy.sh` — deployment will fail with "insufficient balance"
- `tsconfig.json` must target ES2020+ for viem BigInt literals (`0n`, `1n`)
- The zero address (`0x000...000`) is used as a placeholder when VITE_CONTRACT_ADDRESS is not set — the frontend shows a banner in this case
- Run codegen after OpenAPI spec changes: `pnpm --filter @workspace/api-spec run codegen`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Monad skills: https://skills.devnads.com (scaffold, wallet-integration, addresses)
