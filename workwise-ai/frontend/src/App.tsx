import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";

const API_URL = "https://cautious-space-cod-9757gwvxgrjjhx97x-8000.app.github.dev";

type Tab = "resume" | "upload" | "jd" | "email" | "compare" | "interview";

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: "resume", icon: "ti-file-text", label: "Resume Analyzer" },
  { id: "upload", icon: "ti-upload", label: "Upload PDF" },
  { id: "compare", icon: "ti-git-compare", label: "Compare Candidates" },
  { id: "interview", icon: "ti-microphone", label: "Interview Questions" },
  { id: "jd", icon: "ti-clipboard-list", label: "JD Generator" },
  { id: "email", icon: "ti-mail", label: "Email Drafter" },
];

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52,211,153,${p.alpha})`;
        ctx.fill();
      });

      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(52,211,153,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("resume");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [text, setText] = useState("");
  const [text2, setText2] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTabChange = (id: Tab) => {
    setActiveTab(id); setResult(""); setText(""); setText2(""); setJobRole(""); setFile(null); setFile2(null);
  };

  const handleSubmit = async () => {
    setLoading(true); setResult("");
    try {
      if ((activeTab === "resume" || activeTab === "upload" || activeTab === "interview") && file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("job_role", jobRole);
        if (activeTab === "interview") {
          const r = await fetch(`${API_URL}/upload-resume`, { method: "POST", body: fd }).then(r => r.json());
          const res = await fetch(`${API_URL}/interview-questions`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: r.result, job_role: jobRole }),
          });
          const data = await res.json(); setResult(data.result);
        } else {
          const res = await fetch(`${API_URL}/upload-resume`, { method: "POST", body: fd });
          const data = await res.json(); setResult(data.result);
        }
      } else if (activeTab === "compare" && file && file2) {
        const fd1 = new FormData(); fd1.append("file", file); fd1.append("job_role", jobRole);
        const fd2 = new FormData(); fd2.append("file", file2); fd2.append("job_role", jobRole);
        const [r1, r2] = await Promise.all([
          fetch(`${API_URL}/upload-resume`, { method: "POST", body: fd1 }).then(r => r.json()),
          fetch(`${API_URL}/upload-resume`, { method: "POST", body: fd2 }).then(r => r.json()),
        ]);
        const res = await fetch(`${API_URL}/compare-resumes`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resume1: r1.result, resume2: r2.result, job_role: jobRole }),
        });
        const data = await res.json(); setResult(data.result);
      } else if (activeTab === "jd") {
        const res = await fetch(`${API_URL}/generate-jd`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const data = await res.json(); setResult(data.result);
      } else if (activeTab === "email") {
        const res = await fetch(`${API_URL}/draft-email`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const data = await res.json(); setResult(data.result);
      }
    } catch { setResult("Error connecting to backend."); }
    setLoading(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDisabled = loading ||
    (activeTab === "compare" ? (!file || !file2) :
    activeTab === "jd" || activeTab === "email" ? !text : !file);

  const getButtonLabel = () => {
    if (loading) return "Processing...";
    if (activeTab === "resume") return "Analyze Resume";
    if (activeTab === "upload") return "Analyze PDF";
    if (activeTab === "compare") return "Compare Candidates";
    if (activeTab === "interview") return "Generate Questions";
    if (activeTab === "jd") return "Generate JD";
    if (activeTab === "email") return "Draft Email";
  };

  const UploadBox = ({ file, setFile, id, label }: { file: File | null, setFile: (f: File | null) => void, id: string, label: string }) => (
    <div>
      <p style={{ fontSize: "13px", fontWeight: 500, color: "#86c8a8", marginBottom: "8px" }}>{label}</p>
      <label htmlFor={id} style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        border: `2px dashed ${file ? "#34d399" : "#2a5a3a"}`, borderRadius: "10px", padding: "28px",
        cursor: "pointer", background: file ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.02)",
        transition: "all 0.2s",
      }}>
        <i className={`ti ${file ? "ti-file-check" : "ti-cloud-upload"}`} style={{ fontSize: "28px", color: file ? "#34d399" : "#3a8a5a", marginBottom: "8px" }} />
        <span style={{ fontSize: "13px", color: file ? "#34d399" : "#3a8a5a", fontWeight: file ? 600 : 400 }}>
          {file ? file.name : "Click to upload PDF"}
        </span>
        {!file && <span style={{ fontSize: "11px", color: "#1e4a2e", marginTop: "4px" }}>PDF files only</span>}
      </label>
      <input id={id} type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} style={{ display: "none" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d1f16", fontFamily: "'Inter', sans-serif", color: "#fff", position: "relative" }}>
      <AnimatedBackground />
      <div style={{ display: "flex", minHeight: "100vh", position: "relative", zIndex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: "245px", background: "rgba(18,35,24,0.92)", borderRight: "1px solid #1e3a28", backdropFilter: "blur(12px)", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", marginBottom: "24px" }}>
            <Logo />
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#e0faf0" }}>WorkWise AI</div>
              <div style={{ fontSize: "11px", color: "#3a7a5a" }}>HR Operations</div>
            </div>
          </div>

          <div style={{ fontSize: "10px", color: "#2a5a3a", padding: "0 12px", marginBottom: "6px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>Tools</div>

          {tabs.map(tab => (
            <button key={tab.id} onClick={() => handleTabChange(tab.id)} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "8px", border: "none",
              cursor: "pointer", textAlign: "left", width: "100%",
              background: activeTab === tab.id ? "rgba(52,211,153,0.13)" : "transparent",
              color: activeTab === tab.id ? "#6ee7b7" : "#3a7a5a",
              fontSize: "13px", fontWeight: activeTab === tab.id ? 600 : 400,
              transition: "all 0.15s",
            }}>
              <i className={`ti ${tab.icon}`} style={{ fontSize: "15px" }} />
              {tab.label}
              {activeTab === tab.id && <div style={{ marginLeft: "auto", width: "5px", height: "5px", borderRadius: "50%", background: "#34d399" }} />}
            </button>
          ))}

          <div style={{ marginTop: "auto", padding: "14px", background: "rgba(52,211,153,0.05)", borderRadius: "10px", border: "1px solid #1e3a28" }}>
            <div style={{ fontSize: "11px", color: "#34d399", fontWeight: 600, marginBottom: "5px" }}>Powered by</div>
            <div style={{ fontSize: "11px", color: "#2a5a3a", lineHeight: "1.6" }}>Groq LLaMA 3.3<br />LangChain · FastAPI</div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: "40px 48px", overflowY: "auto" }}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#e0faf0", margin: "0 0 6px" }}>
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p style={{ fontSize: "13px", color: "#3a7a5a", margin: 0 }}>
              {activeTab === "resume" && "Upload a PDF resume and get AI-powered scoring and shortlist recommendation."}
              {activeTab === "upload" && "Upload a PDF resume for instant AI analysis."}
              {activeTab === "compare" && "Upload two candidate PDFs and get a side-by-side hiring recommendation."}
              {activeTab === "interview" && "Upload candidate resume to generate tailored interview questions."}
              {activeTab === "jd" && "Describe a role and generate a complete job description instantly."}
              {activeTab === "email" && "Describe the situation and get a professional HR email drafted."}
            </p>
          </div>

          <div style={{ background: "rgba(18,35,24,0.85)", border: "1px solid #1e3a28", borderRadius: "14px", padding: "28px", marginBottom: "24px", backdropFilter: "blur(8px)" }}>

            {(activeTab === "resume" || activeTab === "upload" || activeTab === "compare" || activeTab === "interview") && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#86c8a8", marginBottom: "8px" }}>Target Job Role</label>
                <input value={jobRole} onChange={e => setJobRole(e.target.value)}
                  placeholder="e.g. ML Engineer, React Developer, Data Analyst"
                  style={{ width: "100%", background: "rgba(13,31,22,0.8)", border: "1px solid #1e3a28", borderRadius: "8px", padding: "10px 14px", color: "#e0faf0", fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
              </div>
            )}

            {(activeTab === "resume" || activeTab === "upload" || activeTab === "interview") && (
              <UploadBox file={file} setFile={setFile} id="file1" label="Upload Resume PDF" />
            )}

            {activeTab === "compare" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <UploadBox file={file} setFile={setFile} id="file1" label="Candidate 1 — PDF Resume" />
                <UploadBox file={file2} setFile={setFile2} id="file2" label="Candidate 2 — PDF Resume" />
              </div>
            )}

            {(activeTab === "jd" || activeTab === "email") && (
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#86c8a8", marginBottom: "8px" }}>
                  {activeTab === "jd" ? "Role Description" : "Situation / Context"}
                </label>
                <textarea value={text} onChange={e => setText(e.target.value)} rows={7}
                  placeholder={
                    activeTab === "jd" ? "e.g. Senior ML Engineer for a fintech startup, 4 years experience required..." :
                    "e.g. Rejection email to candidate who applied for ML Engineer role but lacks Python skills..."
                  }
                  style={{ width: "100%", background: "rgba(13,31,22,0.8)", border: "1px solid #1e3a28", borderRadius: "8px", padding: "12px 14px", color: "#e0faf0", fontSize: "14px", boxSizing: "border-box", resize: "vertical", outline: "none", lineHeight: "1.6" }} />
              </div>
            )}

            <button onClick={handleSubmit} disabled={isDisabled} style={{
              marginTop: "20px", padding: "11px 28px",
              background: isDisabled ? "#1e3a28" : "linear-gradient(135deg, #059669, #34d399)",
              color: isDisabled ? "#2a5a3a" : "#fff",
              border: "none", borderRadius: "8px", cursor: isDisabled ? "not-allowed" : "pointer",
              fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
              boxShadow: isDisabled ? "none" : "0 4px 16px rgba(52,211,153,0.2)",
              transition: "all 0.15s",
            }}>
              <i className={`ti ${loading ? "ti-loader-2" : "ti-sparkles"}`} style={{ fontSize: "16px" }} />
              {getButtonLabel()}
            </button>
          </div>

          {result && (
            <div style={{ background: "rgba(18,35,24,0.85)", border: "1px solid #1e3a28", borderRadius: "14px", padding: "24px", backdropFilter: "blur(8px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399" }} />
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#e0faf0" }}>AI Result</span>
                </div>
                <button onClick={copyResult} style={{ background: copied ? "rgba(52,211,153,0.1)" : "transparent", border: "1px solid #1e3a28", borderRadius: "6px", padding: "6px 14px", color: copied ? "#34d399" : "#3a7a5a", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px", fontWeight: 500 }}>
                  <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} style={{ fontSize: "13px" }} />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre style={{ whiteSpace: "pre-wrap", color: "#a7f3d0", fontSize: "13px", lineHeight: "1.8", margin: 0, fontFamily: "inherit" }}>{result}</pre>
            </div>
          )}

          {loading && (
            <div style={{ background: "rgba(18,35,24,0.85)", border: "1px solid #1e3a28", borderRadius: "14px", padding: "48px", textAlign: "center", backdropFilter: "blur(8px)" }}>
              <i className="ti ti-loader-2" style={{ fontSize: "34px", color: "#34d399", display: "block", marginBottom: "12px" }} />
              <div style={{ fontSize: "14px", color: "#3a7a5a" }}>AI is processing your request...</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
