import { useState, useRef, useEffect } from "react";
import { FileText, Pencil, Upload, Loader2 } from 'lucide-react'

export default function ResumeCard() {

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchResume() {
  try {
    const response = await fetch(
      `/api/resume`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const data = await response.json();

    if (response.ok) {
      setResume(data);
    }

  } catch (err) {
    console.error(err);
  }
}

  useEffect(() => {
    fetchResume();
  }, []);

  const inputRef = useRef(null);

  const handleFileChange = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF resumes are allowed");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      

      const response = await fetch(
        `/api/resume/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if(response.ok) {
        fetchResume();
      }
    }
    catch (err) {
      setError(err.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#161822] border border-white/8 rounded-2xl p-5 flex flex-col gap-4">
      <h3 className="text-base font-semibold text-white">Current Resume</h3>

      {resume ? (
        <div className="flex items-center gap-3 bg-[#1c1f2e] rounded-xl p-3.5">
          <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {resume?resume.resumeFileName:"Resume Not Found"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Uploaded on:{' '}
              {resume.uploadedAt
                ? new Date(resume.uploadedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : '—'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-[#1c1f2e] rounded-xl p-3.5">
          <div className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-sm text-slate-500">No resume uploaded yet.</p>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="self-end flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-all disabled:opacity-50"
      >
        {loading
          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</>
          : resume
            ? <><Pencil className="w-3.5 h-3.5" /> Change</>
            : <><Upload className="w-3.5 h-3.5" /> Upload Resume</>
        }
      </button>
    </div>
  )
}