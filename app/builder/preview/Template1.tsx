"use client";

interface Experience {
  id: string;
  jobTitle?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface Education {
  id: string;
  degree?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
}

interface ResumeData {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  experiences?: Experience[];
  educations?: Education[];
  projects?: unknown[]; // You can define a Project interface if needed
  skills?: string[];
  website?: string;
  github?: string;
  linkedin?: string;
}

export default function TemplateMichael({ data }: { data: ResumeData }) {
  const d = {
    fullName: data.fullName || "Full Name",
    title: data.title || "Job Title",
    email: data.email || "email@example.com",
    phone: data.phone || "000-000-0000",
    location: data.location || "City, Country",
    summary: data.summary || "",
    experiences: data.experiences || [],
    educations: data.educations || [],
    projects: data.projects || [],
    skills: data.skills || [],
    website: data.website || "",
    github: data.github || "",
    linkedin: data.linkedin || "",
  };

  return (
    <article className="max-w-[210mm] w-[210mm] bg-white p-6" style={{ minHeight: "297mm" }}>
      {/* header */}
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">{d.fullName}</h1>
        <p className="text-sm text-gray-600">
          {d.title} • {d.location}
        </p>
        <p className="text-sm text-gray-500">
          {d.email} • {d.phone}
        </p>
      </header>

      {/* summary */}
      <section className="mb-4">
        <h4 className="uppercase text-xs text-gray-500 tracking-wider">Summary</h4>
        <p className="mt-1 text-sm text-gray-700">{d.summary}</p>
      </section>

      {/* experience */}
      <section className="mb-4">
        <h4 className="uppercase text-xs text-gray-500 tracking-wider">Experience</h4>
        <div className="mt-2 space-y-3">
          {d.experiences.length === 0 && (
            <p className="text-sm text-gray-500">No experience added.</p>
          )}
          {d.experiences.map((e) => (
            <div key={e.id} className="text-sm">
              <div className="flex justify-between">
                <strong>{e.jobTitle || "Job Title"}</strong>
                <span className="text-gray-500 text-xs">
                  {e.startDate} — {e.endDate || "Present"}
                </span>
              </div>
              <div className="text-gray-700">{e.company}</div>
              {e.description && (
                <ul className="list-disc ml-5 text-gray-700 mt-1">
                  <li>{e.description}</li>
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* education */}
      <section className="mb-4">
        <h4 className="uppercase text-xs text-gray-500 tracking-wider">Education</h4>
        <div className="mt-2 space-y-2">
          {d.educations.length === 0 && (
            <p className="text-sm text-gray-500">No education added.</p>
          )}
          {d.educations.map((ed) => (
            <div key={ed.id} className="text-sm">
              <div className="flex justify-between">
                <strong>{ed.degree}</strong>
                <span className="text-gray-500 text-xs">
                  {ed.startDate} — {ed.endDate}
                </span>
              </div>
              <div className="text-gray-700">{ed.institution}</div>
            </div>
          ))}
        </div>
      </section>

      {/* skills */}
      <section>
        <h4 className="uppercase text-xs text-gray-500 tracking-wider">Skills</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {d.skills.length === 0 && (
            <span className="text-sm text-gray-500">No skills added.</span>
          )}
          {d.skills.map((s, i) => (
            <span key={i} className="text-xs px-2 py-1 border rounded text-gray-700">
              {s}
            </span>
          ))}
        </div>
      </section>
    </article>
  );
}