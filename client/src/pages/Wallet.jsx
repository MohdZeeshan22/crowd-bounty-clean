import { useEffect, useState } from "react";
import axios from "axios";
import "./Wallet.scss";

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/wallet",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWallet(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load wallet data");
      }
    };

    fetchWallet();
  }, []);

  if (error) return <div className="wallet-error">{error}</div>;
  if (wallet === null) return <div className="wallet-loading">Loading...</div>;

  return (
    <div className="wallet-container">
      <h2 className="wallet-title">💰 Hacker Wallet</h2>

      {/* Total Earnings */}
      <div className="wallet-total-widget">
        <h3>Total Earnings</h3>
        <h1>₹ {wallet.total || 0}</h1>
      </div>

      {/* Transactions */}
      <div className="wallet-grid">
        {wallet.transactions?.length === 0 && (
          <p className="no-earnings">No earnings yet.</p>
        )}

        {wallet.transactions?.map((tx) => (
          <div key={tx._id} className="wallet-widget">
            
            <div className="widget-row">
              <span className="label">🐞 Bug:</span>
              <span className="value">
                {tx.bug?.title || "Unknown Bug"}
              </span>
            </div>

            <div className="widget-row">
              <span className="label">🏢 Company:</span>
              <span className="value">
                {tx.company?.email || "Unknown Company"}
              </span>
            </div>

            <div className="widget-row amount">
              ₹ {tx.amount}
            </div>

            <div className="widget-date">
              {tx.createdAt
                ? new Date(tx.createdAt).toLocaleDateString()
                : "-"}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}