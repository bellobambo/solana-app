"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

export default function PredictionApp() {
  // Initialize Solflare wallet adapter
  const wallet = new SolflareWalletAdapter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState("");
  const [userHistory, setUserHistory] = useState([]);

  // Sample data - replace with real API calls
  const [rounds, setRounds] = useState([
    {
      id: "#360955",
      status: "LIVE",
      payout: "172x",
      prizePool: "597.2656 SOL",
      lockedPrice: "$597.0610",
      lockedAmount: "7.7163 SOL",
      upPayout: "172x",
      downPayout: "239x",
      startTime: "04:30",
      endTime: "04:45",
      participants: "1,243",
      volume: "5,723 SOL",
    },
    {
      id: "#360956",
      status: "NEXT",
      payout: "20.63x",
      prizePool: "369.4200 SOL",
      upPayout: "20.63x",
      downPayout: "105x",
      startTime: "04:45",
      endTime: "05:00",
      participants: "872",
      volume: "3,215 SOL",
    },
    {
      id: "#360957",
      status: "UPCOMING",
      payout: "15.42x",
      prizePool: "215.7800 SOL",
      startTime: "05:00",
      endTime: "05:15",
      participants: "421",
      volume: "1,856 SOL",
    },
  ]);

  // User positions
  const [userPositions, setUserPositions] = useState([
    {
      round: "#360953",
      direction: "UP",
      amount: "5 SOL",
      payout: "8.42x",
      status: "WON",
      reward: "42.1 SOL",
    },
  ]);

  const makePrediction = async (direction, roundId) => {
    if (!publicKey || !connected) {
      alert("Please connect your Solflare wallet first");
      return;
    }

    setLoading(true);

    try {
      const dummyAddress = new PublicKey(
        "HN5hBZ7j9FkqVv1sTkZQ1qgq7k9XZ2Xn6qY7Lm7JqZq" // Replace with your actual mainnet program ID
      );
      const lamports = 1000000; // 1 SOL (mainnet uses real value)

      // Add recent blockhash and fee payer
      const { blockhash } = await connection.getRecentBlockhash();
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: dummyAddress,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setTxSignature(signature);

      // Update transaction link to mainnet
      const newEntry = {
        round: roundId,
        direction,
        amount: "1 SOL",
        timestamp: new Date().toLocaleTimeString(),
        tx: `https://explorer.solana.com/tx/${signature}`,
      };

      setUserHistory([...userHistory, newEntry]);
      alert(`Prediction submitted: ${direction} in ${roundId}`);
    } catch (error) {
      console.error("Error submitting prediction:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-900 text-white">
      {/* Header Navigation */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <div className="flex space-x-6">
          <button className="text-lg font-semibold">Trade</button>
          <button className="text-lg font-semibold">Earn</button>
          <button className="text-lg font-semibold text-yellow-400 border-b-2 border-yellow-400">
            Prediction
          </button>
          <button className="text-lg font-semibold">Lottery</button>
        </div>
        <WalletMultiButton
          className="bg-purple-600 hover:bg-purple-700 rounded-lg"
          startIcon={
            <img
              src="/solflare-icon.png"
              className="w-5 h-5 mr-2"
              alt="Solflare"
            />
          }
        >
          {connected ? "Connected" : "Connect Solflare"}
        </WalletMultiButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Prediction Area */}
        <div className="lg:col-span-2">
          {/* Current Round Card */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="bg-red-500 text-xs px-2 py-1 rounded mr-2">
                  {rounds[0].status}
                </span>
                <span className="font-bold">{rounds[0].id}</span>
              </div>
              <div className="text-yellow-400 font-bold">
                {rounds[0].payout} Payout
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Prize Pool</div>
                <div className="text-2xl font-bold">{rounds[0].prizePool}</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Participants</div>
                <div className="text-2xl font-bold">
                  {rounds[0].participants}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Locked Price</div>
                <div className="font-bold">{rounds[0].lockedPrice}</div>
                <div className="text-sm">{rounds[0].lockedAmount}</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Volume</div>
                <div className="font-bold">{rounds[0].volume}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-600/20 p-3 rounded-lg border border-green-600">
                <div className="text-sm text-gray-300 mb-1">UP Payout</div>
                <div className="font-bold text-green-400">
                  {rounds[0].upPayout}
                </div>
              </div>
              <div className="bg-red-600/20 p-3 rounded-lg border border-red-600">
                <div className="text-sm text-gray-300 mb-1">DOWN Payout</div>
                <div className="font-bold text-red-400">
                  {rounds[0].downPayout}
                </div>
              </div>
            </div>
          </div>

          {/* Next Rounds */}
          {rounds.slice(1).map((round, index) => (
            <div key={round.id} className="bg-gray-800 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded mr-2 ${
                      round.status === "NEXT" ? "bg-blue-500" : "bg-gray-600"
                    }`}
                  >
                    {round.status}
                  </span>
                  <span className="font-bold">{round.id}</span>
                </div>
                <div className="text-yellow-400 font-bold">
                  {round.payout} Payout
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Prize Pool</div>
                  <div className="font-bold">{round.prizePool}</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Starts In</div>
                  <div className="font-bold">{round.startTime}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => makePrediction("UP", round.id)}
                  disabled={loading || round.status !== "NEXT" || !connected}
                  className={`bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold ${
                    loading || round.status !== "NEXT" || !connected
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  Enter UP
                </button>
                <button
                  onClick={() => makePrediction("DOWN", round.id)}
                  disabled={loading || round.status !== "NEXT" || !connected}
                  className={`bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold ${
                    loading || round.status !== "NEXT" || !connected
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  Enter DOWN
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Wallet Connection Status */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Wallet Status</h3>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <img
                  src="/solflare-icon.png"
                  className="w-6 h-6 mr-2"
                  alt="Solflare"
                />
                <span className="font-bold">
                  {connected ? "Solflare Connected" : "Not Connected"}
                </span>
              </div>
              {connected && (
                <div className="text-sm break-all">
                  {publicKey.toString().slice(0, 6)}...
                  {publicKey.toString().slice(-4)}
                </div>
              )}
            </div>
          </div>

          {/* Your Positions */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-lg mb-4">Your Positions</h3>
            {connected ? (
              userPositions.length > 0 ? (
                userPositions.map((position, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-700 py-3 last:border-0"
                  >
                    <div className="flex justify-between">
                      <span className="font-bold">{position.round}</span>
                      <span
                        className={`font-bold ${
                          position.status === "WON"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {position.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>
                        {position.direction} {position.amount}
                      </span>
                      <span>Payout: {position.payout}</span>
                    </div>
                    {position.status === "WON" && (
                      <div className="text-right text-sm text-green-400">
                        +{position.reward}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No active positions
                </div>
              )
            ) : (
              <div className="text-gray-400 text-center py-4">
                Connect wallet to view positions
              </div>
            )}
          </div>

          {/* Recent History */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4">Recent History</h3>
            {connected ? (
              userHistory.length > 0 ? (
                userHistory.slice(0, 5).map((entry, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-700 py-3 last:border-0"
                  >
                    <div className="flex justify-between">
                      <span className="font-bold">{entry.round}</span>
                      <span
                        className={`font-bold ${
                          entry.direction === "UP"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {entry.direction}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{entry.amount}</span>
                      <span>{entry.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No prediction history
                </div>
              )
            ) : (
              <div className="text-gray-400 text-center py-4">
                Connect wallet to view history
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Signature */}
      {txSignature && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg break-all">
          <div className="text-sm text-gray-400 mb-1">Latest Transaction:</div>
          <a
            href={`https://explorer.solana.com/tx/${txSignature}`} // Removed ?cluster=devnet
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            {txSignature}
          </a>
        </div>
      )}
    </div>
  );
}
