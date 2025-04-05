"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

export default function WalletProviders({ children }) {
  // Set to Mainnet
  const network = WalletAdapterNetwork.Mainnet;

  // Use either default mainnet endpoint or a custom RPC
  const endpoint = useMemo(() => {
    // Option 1: Default Solana mainnet cluster
    // return clusterApiUrl(network);

    // Option 2: Recommended - Use a dedicated RPC provider
    return "https://api.mainnet-beta.solana.com"; // Default Solana RPC
    // Or from providers like:
    // return "https://solana-mainnet.rpc.extrnode.com";
    // return "https://rpc.ankr.com/solana";
  }, [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({ network }),
      // Add other wallets if needed:
      // new SolflareWalletAdapter({ network }),
      // new GlowWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
