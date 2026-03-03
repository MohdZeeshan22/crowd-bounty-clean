import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CompanyWallet.scss";

export default function CompanyWallet() {
  const [wallet, setWallet] = useState({
    walletBalance: 0,
    totalPaid: 0,
    transactions: []
  });

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* =========================
     FETCH WALLET
  ========================= */
  const fetchWallet = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/company/wallet",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Wallet error:", data);
        return;
      }

      setWallet({
        walletBalance: data.walletBalance || 0,
        totalPaid: data.totalPaid || 0,
        transactions: data.transactions || []
      });

    } catch (err) {
      console.error("Wallet fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("company-theme");
    fetchWallet();

    return () => {
      document.body.classList.remove("company-theme");
    };
  }, []);

  /* =========================
     ADD FUNDS (FIXED)
  ========================= */
  const handleAddFunds = async () => {
    const amountInput = prompt("Enter amount to add:");
    const amount = Number(amountInput);

    if (!amount || amount <= 0) {
      alert("Invalid amount");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/company/wallet/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Failed to add funds");
        return;
      }

      alert("Funds added successfully ✅");
      fetchWallet();

    } catch (err) {
      console.error("Add funds error:", err);
      alert("Server error");
    }
  };

  if (loading) return <div className="company-page">Loading...</div>;

  return (
    <div className="company-page">

      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate("/company")}>
          ⬅ Back
        </button>
        <h1>Company Wallet</h1>
      </div>

      <div className="wallet-summary">
        <div className="stat-box">
          <h3>Current Balance</h3>
          <p>₹{wallet.walletBalance}</p>
        </div>

        <div className="stat-box">
          <h3>Total Paid</h3>
          <p>₹{wallet.totalPaid}</p>
        </div>

        <div className="stat-box add-funds-box">
          <h3>Top Up Wallet</h3>
          <button
            className="add-funds-btn"
            onClick={handleAddFunds}
          >
            + Add Funds
          </button>
        </div>
      </div>

      <div className="transactions">
        <h2>Transaction History</h2>

        {wallet.transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Bug</th>
                <th>Hacker</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {wallet.transactions.map((t) => (
                <tr key={t._id}>
                  <td>{t.bug?.title || "-"}</td>
                  <td>{t.hacker?.name || t.hacker?.email || "-"}</td>
                  <td>₹{t.amount}</td>
                  <td>
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}