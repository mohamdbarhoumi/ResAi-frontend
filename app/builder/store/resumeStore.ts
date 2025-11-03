// app/resume/builder/store/resumeStore.ts
import {create} from "zustand"

export type Experience = {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[]; // array of strings
};

export type ResumeState = {
  // Personal
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  website?: string;
  github?: string;
  linkedin?: string;

  // Arrays
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  skills: string[];

  // actions
  setPersonal: (payload: Partial<ResumeState>) => void;
  addExperience: (exp: Partial<Experience>) => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  removeExperience: (id: string) => void;

  addEducation: (edu: Partial<Education>) => void;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  addProject: (proj: Partial<Project>) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;

  setSkills: (skills: string[]) => void;
  clearAll: () => void;
};

const id = () => Math.random().toString(36).slice(2, 9);

export const useResumeStore = create<ResumeState>((set, get) => ({
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  website: "",
  github: "",
  linkedin: "",

  experiences: [],
  educations: [],
  projects: [],
  skills: [],

  setPersonal: (payload) => set((s) => ({ ...s, ...payload })),

  addExperience: (exp) =>
    set((s) => ({
      experiences: [
        ...s.experiences,
        {
          id: id(),
          jobTitle: exp.jobTitle || "",
          company: exp.company || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          description: exp.description || "",
        },
      ],
    })),

  updateExperience: (idToUpdate, patch) =>
    set((s) => ({
      experiences: s.experiences.map((e) => (e.id === idToUpdate ? { ...e, ...patch } : e)),
    })),

  removeExperience: (idToRemove) =>
    set((s) => ({ experiences: s.experiences.filter((e) => e.id !== idToRemove) })),

  addEducation: (edu) =>
    set((s) => ({
      educations: [
        ...s.educations,
        {
          id: id(),
          degree: edu.degree || "",
          institution: edu.institution || "",
          startDate: edu.startDate || "",
          endDate: edu.endDate || "",
        },
      ],
    })),

  updateEducation: (idToUpdate, patch) =>
    set((s) => ({ educations: s.educations.map((x) => (x.id === idToUpdate ? { ...x, ...patch } : x)) })),

  removeEducation: (idToRemove) =>
    set((s) => ({ educations: s.educations.filter((x) => x.id !== idToRemove) })),

  addProject: (proj) =>
    set((s) => ({
      projects: [
        ...s.projects,
        {
          id: id(),
          title: proj.title || "",
          description: proj.description || "",
          technologies: proj.technologies || [],
        },
      ],
    })),

  updateProject: (idToUpdate, patch) =>
    set((s) => ({ projects: s.projects.map((p) => (p.id === idToUpdate ? { ...p, ...patch } : p)) })),

  removeProject: (idToRemove) =>
    set((s) => ({ projects: s.projects.filter((p) => p.id !== idToRemove) })),

  setSkills: (skills) => set(() => ({ skills })),

  clearAll: () =>
    set(() => ({
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      website: "",
      github: "",
      linkedin: "",
      experiences: [],
      educations: [],
      projects: [],
      skills: [],
    })),
}));
