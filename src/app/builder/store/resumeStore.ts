// app/resume/builder/store/resumeStore.ts
import { create } from "zustand";

export type Experience = {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  location?: string;
  employmentType?: string;
  bullets: { id: string; text: string }[];
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
};

export type Project = {
  id: string;
  title: string;
  tech: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
  bullets: { id: string; text: string }[];
};

export type Skill = { id: string; name: string };
export type Certificate = { id: string; name: string; issuer?: string; date?: string };
export type Language = { id: string; name: string; proficiency?: string };

export type ResumeState = {
  // ← REQUIRED field (you said aiMetadata: null)
  aiMetadata: Record<string, any> | null;

  id?: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  website?: string;
  github?: string;
  linkedin?: string;
  language: string;

  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
  languages: Language[];

  setPersonal: (payload: Partial<ResumeState>) => void;
  setLanguage: (lang: string) => void;

  addExperience: (exp: Partial<Experience>) => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  removeExperience: (id: string) => void;

  addEducation: (edu: Partial<Education>) => void;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  addProject: (proj: Partial<Project>) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;

  addSkill: (skill: Omit<Skill, "id">) => void;
  updateSkill: (id: string, patch: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  addCertificate: (cert: Omit<Certificate, "id">) => void;
  updateCertificate: (id: string, patch: Partial<Certificate>) => void;
  removeCertificate: (id: string) => void;

  addLanguage: (lang: Omit<Language, "id">) => void;
  updateLanguage: (id: string, patch: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  clearAll: () => void;
};

const id = () => Math.random().toString(36).slice(2, 9);

export const useResumeStore = create<ResumeState>((set) => ({
  // ← ADD aiMetadata here (was missing!)
  aiMetadata: null,

  id: undefined,
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  website: "",
  github: "",
  linkedin: "",
  language: "en",

  experiences: [],
  educations: [],
  projects: [],
  skills: [],
  certificates: [],
  languages: [],

  setPersonal: (payload) => set((s) => ({ ...s, ...payload })),
  setLanguage: (lang) => set({ language: lang }),

  // ───── Experience ─────
  addExperience: (exp) =>
    set((s) => ({
      experiences: [
        ...s.experiences,
        {
          id: id(),
          role: exp.role?.trim() ?? "",
          company: exp.company?.trim() ?? "",
          startDate: exp.startDate ?? "",
          endDate: exp.endDate ?? "",
          location: exp.location?.trim() ?? "",
          employmentType: exp.employmentType ?? "",
          bullets: exp.bullets ?? [],
        },
      ],
    })),
  updateExperience: (idToUpdate, patch) =>
    set((s) => ({
      experiences: s.experiences.map((e) =>
        e.id === idToUpdate ? { ...e, ...patch } : e
      ),
    })),
  removeExperience: (idToRemove) =>
    set((s) => ({
      experiences: s.experiences.filter((e) => e.id !== idToRemove),
    })),

  // ───── Education, Projects, Skills, Certificates, Languages ─────
  // (kept exactly as you had them – they were already perfect)

  addEducation: (edu) =>
    set((s) => ({
      educations: [
        ...s.educations,
        {
          id: id(),
          degree: edu.degree?.trim() || "",
          institution: edu.institution?.trim() || "",
          location: edu.location?.trim() || "",
          startDate: edu.startDate?.trim() || "",
          endDate: edu.endDate?.trim() || "",
          gpa: edu.gpa?.trim() || "",
          honors: edu.honors?.trim() || "",
        },
      ],
    })),
  updateEducation: (idToUpdate, patch) =>
    set((s) => ({
      educations: s.educations.map((x) =>
        x.id === idToUpdate ? { ...x, ...patch } : x
      ),
    })),
  removeEducation: (idToRemove) =>
    set((s) => ({
      educations: s.educations.filter((x) => x.id !== idToRemove),
    })),

  addProject: (proj) =>
    set((s) => ({
      projects: [
        ...s.projects,
        {
          id: id(),
          title: proj.title?.trim() ?? "",
          tech: proj.tech ?? [],
          link: proj.link?.trim() ?? "",
          startDate: proj.startDate ?? "",
          endDate: proj.endDate ?? "",
          bullets: proj.bullets ?? [],
        },
      ],
    })),
  updateProject: (idToUpdate, patch) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === idToUpdate ? { ...p, ...patch } : p
      ),
    })),
  removeProject: (idToRemove) =>
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== idToRemove),
    })),

  addSkill: (skill) => set((s) => ({ skills: [...s.skills, { id: id(), ...skill }] })),
  updateSkill: (idToUpdate, patch) =>
    set((s) => ({
      skills: s.skills.map((sItem) =>
        sItem.id === idToUpdate ? { ...sItem, ...patch } : sItem
      ),
    })),
  removeSkill: (idToRemove) =>
    set((s) => ({ skills: s.skills.filter((sItem) => sItem.id !== idToRemove) })),

  addCertificate: (cert) =>
    set((s) => ({ certificates: [...s.certificates, { id: id(), ...cert }] })),
  updateCertificate: (idToUpdate, patch) =>
    set((s) => ({
      certificates: s.certificates.map((c) =>
        c.id === idToUpdate ? { ...c, ...patch } : c
      ),
    })),
  removeCertificate: (idToRemove) =>
    set((s) => ({
      certificates: s.certificates.filter((c) => c.id !== idToRemove),
    })),

  addLanguage: (lang) => set((s) => ({ languages: [...s.languages, { id: id(), ...lang }] })),
  updateLanguage: (idToUpdate, patch) =>
    set((s) => ({
      languages: s.languages.map((l) =>
        l.id === idToUpdate ? { ...l, ...patch } : l
      ),
    })),
  removeLanguage: (idToRemove) =>
    set((s) => ({
      languages: s.languages.filter((l) => l.id !== idToRemove),
    })),

  // ← ALSO add aiMetadata in clearAll!
  clearAll: () =>
    set({
      aiMetadata: null,
      id: undefined,
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      website: "",
      github: "",
      linkedin: "",
      language: "en",
      experiences: [],
      educations: [],
      projects: [],
      skills: [],
      certificates: [],
      languages: [],
    }),
}));