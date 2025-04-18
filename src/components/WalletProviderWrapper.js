"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

export default function WalletProviderWrapper({ children }) {
  // Set to mainnet
  const network = WalletAdapterNetwork.Mainnet;

  const endpoint = useMemo(() => {
    return "https://api.mainnet-beta.solana.com"; // Default Solana mainnet RPC
  }, [network]);

  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter({ network }),
      // Add other wallets if needed
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
