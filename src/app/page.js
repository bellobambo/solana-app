"use client";

import dynamic from "next/dynamic";
import { Providers } from "./providers";
import PredictionApp from "../components/PredictionApp";

// Dynamically import WalletMultiButton to avoid SSR
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  return (
    <Providers>
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Solana Predictor</h1>
          <WalletMultiButton className="bg-purple-500 hover:bg-purple-600 rounded-lg px-4 py-2" />
        </header>

        <main>
          <PredictionApp />
        </main>
      </div>
    </Providers>
  );
}
