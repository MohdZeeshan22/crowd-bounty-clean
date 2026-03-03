import { useEffect, useState } from "react";
import { submitBug, API } from "../api/bug";
import "./SubmitBug.scss";

export default function SubmitBug() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("low");
  const [company, setCompany] = useState("");
  const [testUrl, setTestUrl] = useState("");
  const [payload, setPayload] = useState("");
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     Load Company List
  ========================= */
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await API.get("/auth/companies");
        setCompanies(res.data.companies || []);
      } catch (err) {
        console.error("COMPANY FETCH ERROR:", err);
        setCompanies([]);
      }
    };

    fetchCompanies();
  }, []);

  /* =========================
     Submit Bug
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Frontend validation before sending to backend
    if (!testUrl.trim()) {
      setMessage(" Affected URL is required");
      setLoading(false);
      return;
    }

    if (!payload.trim()) {
      setMessage(" Test payload is required");
      setLoading(false);
      return;
    }

    try {
      await submitBug({
        title,
        description,
        severity,
        company,
        testUrl: testUrl.trim(),
        payload: payload.trim(),
      });

      setMessage(" Bug submitted successfully");

      // Reset form fields
      setTitle("");
      setDescription("");
      setSeverity("low");
      setCompany("");
      setTestUrl("");
      setPayload("");

    } catch (err) {
      console.error("BUG SUBMISSION ERROR:", err);
      setMessage(
        err?.response?.data?.msg ||
        err?.message ||
        " Failed to submit bug"
      );
    }

    setLoading(false);
  };

  return (
    <div className="submit-bug-page">
      <form className="submit-card" onSubmit={handleSubmit}>
        <h2>Submit Vulnerability</h2>

        {message && <p className="message">{message}</p>}

        <input
          placeholder="Bug Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Describe the vulnerability"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* AFFECTED URL */}
        <input
          placeholder="Affected URL (e.g. https://httpbin.org/get)"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          required
        />

        {/* PAYLOAD */}
        <textarea
          placeholder="Test Payload (e.g. <script>alert(1)</script>)"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          required
        />

        {/* COMPANY SELECT */}
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        >
          <option value="">Select Company</option>

          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name || c.email}
            </option>
          ))}
        </select>

        {/* SEVERITY */}
        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Bug"}
        </button>
      </form>
    </div>
  );
}
