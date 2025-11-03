"use client";

import { useResumeStore } from "../store/resumeStore";
import { ChangeEvent } from "react";

export default function StepPersonal() {
  const fullName = useResumeStore((s) => s.fullName);
  const title = useResumeStore((s) => s.title);
  const email = useResumeStore((s) => s.email);
  const phone = useResumeStore((s) => s.phone);
  const location = useResumeStore((s) => s.location);
  const summary = useResumeStore((s) => s.summary);
  const website = useResumeStore((s) => s.website);
  const github = useResumeStore((s) => s.github);
  const linkedin = useResumeStore((s) => s.linkedin);

  const setPersonal = useResumeStore((s) => s.setPersonal);

  const onChange =
    (key: keyof Parameters<typeof setPersonal>[0]) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPersonal({ [key]: e.target.value });
    };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-600">Full name</label>
        <input value={fullName} onChange={onChange("fullName")} className="input mt-1"/>
      </div>

      <div>
        <label className="text-sm text-gray-600">Job title</label>
        <input value={title} onChange={onChange("title")} className="input mt-1"/>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input value={email} onChange={onChange("email")} className="input mt-1"/>
        </div>
        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <input value={phone} onChange={onChange("phone")} className="input mt-1"/>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-600">Location</label>
        <input value={location} onChange={onChange("location")} className="input mt-1"/>
      </div>

      <div>
        <label className="text-sm text-gray-600">Summary</label>
        <textarea value={summary} onChange={onChange("summary")} rows={4} className="input mt-1"/>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm text-gray-600">Website</label>
          <input value={website} onChange={onChange("website")} className="input mt-1"/>
        </div>
        <div>
          <label className="text-sm text-gray-600">GitHub</label>
          <input value={github} onChange={onChange("github")} className="input mt-1"/>
        </div>
        <div>
          <label className="text-sm text-gray-600">LinkedIn</label>
          <input value={linkedin} onChange={onChange("linkedin")} className="input mt-1"/>
        </div>
      </div>
    </div>
  );
}
