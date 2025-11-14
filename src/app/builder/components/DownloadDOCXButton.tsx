/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ExternalHyperlink,
  convertInchesToTwip,
} from "docx";
import { saveAs } from "file-saver";

interface DownloadDOCXButtonProps {
  snapshot: Record<string, any>;
  fileName?: string;
  className?: string;
}

export default function DownloadDOCXButton({
  snapshot,
  fileName,
  className,
}: DownloadDOCXButtonProps) {
  const [generating, setGenerating] = useState(false);

  const data = snapshot?.data || snapshot;

  const sectionTitles = {
    en: {
      summary: "SUMMARY",
      experience: "EXPERIENCE",
      projects: "PROJECTS",
      education: "EDUCATION",
      skills: "SKILLS",
      certificates: "CERTIFICATES",
      languages: "LANGUAGES",
    },
    fr: {
      summary: "RÉSUMÉ",
      experience: "EXPÉRIENCE PROFESSIONNELLE",
      projects: "PROJETS",
      education: "FORMATION",
      skills: "COMPÉTENCES",
      certificates: "CERTIFICATIONS",
      languages: "LANGUES",
    },
  };

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const lang = (data.language || "en") as "en" | "fr";
      const titles = sectionTitles[lang];

      const children: Paragraph[] = [];

      // Header - Name
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: data.fullName || "John Doe",
              bold: true,
              size: 32,
            }),
          ],
        })
      );

      // Job Title
      if (data.title) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: data.title,
                size: 24,
              }),
            ],
          })
        );
      }

      // Contact Information
      const contactParts: string[] = [];
      if (data.email) contactParts.push(data.email);
      if (data.phone) contactParts.push(data.phone);
      if (data.location) contactParts.push(data.location);

      if (contactParts.length > 0) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: contactParts.join(" | "),
                size: 20,
              }),
            ],
          })
        );
      }

      // LinkedIn and GitHub
      const linkParts: any[] = [];
      if (data.linkedin) {
        linkParts.push(
          new ExternalHyperlink({
            link: data.linkedin,
            children: [
              new TextRun({ text: "LinkedIn", style: "Hyperlink", size: 20 }),
            ],
          })
        );
        linkParts.push(new TextRun({ text: " | ", size: 20 }));
      }
      if (data.github) {
        linkParts.push(
          new ExternalHyperlink({
            link: data.github,
            children: [
              new TextRun({ text: "GitHub", style: "Hyperlink", size: 20 }),
            ],
          })
        );
      }
      if (linkParts.length > 0) {
        // remove trailing separator
        if (linkParts[linkParts.length - 1].text === " | ") linkParts.pop();
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: linkParts,
          })
        );
      }

      // Summary
      if (data.summary) {
        children.push(
          new Paragraph({
            text: titles.summary,
            heading: HeadingLevel.HEADING_1,
            thematicBreak: true,
            spacing: { before: 200, after: 100 },
          })
        );
        children.push(
          new Paragraph({
            spacing: { after: 200 },
            alignment: AlignmentType.JUSTIFIED,
            children: [new TextRun({ text: data.summary })],
          })
        );
      }

      // Experience
      if (data.experiences?.length > 0) {
        children.push(
          new Paragraph({
            text: titles.experience,
            heading: HeadingLevel.HEADING_1,
            thematicBreak: true,
            spacing: { before: 200, after: 100 },
          })
        );

        data.experiences.forEach((exp: any) => {
          // Role + Date
          const roleChildren: TextRun[] = [
            new TextRun({ text: exp.role || "", bold: true, size: 22 }),
          ];
          if (exp.startDate || exp.endDate) {
            roleChildren.push(
              new TextRun({
                text: ` (${exp.startDate || ""} – ${exp.endDate || "Present"})`,
                size: 20,
                ital: true, // ✅ correct property
              })
            );
          }
          children.push(
            new Paragraph({ spacing: { after: 50 }, children: roleChildren })
          );

          // Company
          if (exp.company) {
            children.push(
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({ text: exp.company, ital: true }),
                ],
              })
            );
          }

          // Bullets
          exp.bullets?.forEach((bullet: any) => {
            if (bullet?.text?.trim()) {
              children.push(
                new Paragraph({
                  spacing: { after: 50 },
                  bullet: { level: 0 },
                  children: [new TextRun({ text: bullet.text })],
                })
              );
            }
          });
        });
      }

      // TODO: Repeat similar fixes for projects, education, certificates, languages
      // Anywhere you used italics/ital, make sure it is **inside TextRun**, not Paragraph

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: convertInchesToTwip(0.5),
                  right: convertInchesToTwip(0.5),
                  bottom: convertInchesToTwip(0.5),
                  left: convertInchesToTwip(0.5),
                },
              },
            },
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(
        blob,
        fileName || `${data?.fullName?.trim() || "Resume"}.docx`
      );
    } catch (err) {
      console.error("Error generating DOCX:", err);
      alert("Failed to generate DOCX");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className={
        className ||
        "flex-1 px-4 py-2 border border-gray-300 rounded text-center text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      {generating ? "Generating…" : "Export DOCX"}
    </button>
  );
}
