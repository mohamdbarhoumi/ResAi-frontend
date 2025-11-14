/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Svg,
  Path,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: "#000",
  },

  header: {
    marginBottom: 12,
    textAlign: "center",
  },

  name: {
    fontSize: 24,
    marginBottom: 2,
  },

  jobTitle: {
    fontSize: 12,
    marginBottom: 4,
  },

  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 2,
  },

  contactItem: {
    marginHorizontal: 8,
    fontSize: 9,
  },

  contactItemWithIcon: {
    flexDirection: "row",
    marginHorizontal: 8,
    fontSize: 9,
    flexShrink: 1,
  },

  link: {
    color: "#000",
    textDecoration: "none",
  },

  sectionTitle: {
    fontSize: 11,
    marginTop: 10,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1.5,
    borderBottomColor: "#000",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  summaryText: {
    fontSize: 9.5,
    lineHeight: 1.4,
    textAlign: "justify",
    marginBottom: 6,
  },

  item: {
    marginBottom: 10,
  },

  titleText: {
    fontSize: 10,
    marginBottom: 1,
  },

  secondaryText: {
    fontSize: 9,
    color: "#555",
    marginBottom: 2,
  },

  dateLocationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 4,
  },

  bulletPoint: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 6,
  },

  bullet: {
    width: 10,
    fontSize: 8,
  },

  bulletText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.3,
  },

  skillBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
    borderRadius: 2,
    fontSize: 8,
  },

  projectLink: {
    color: "#0066cc",
    textDecoration: "underline",
  },
});

// translations
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

const renderBullets = (bullets: any[] = []) =>
  bullets
    .map((b) => (b?.text ? { text: b.text.trim() } : null))
    .filter(Boolean)
    .map((b, i) => (
      <View key={`bullet-${i}`} style={styles.bulletPoint}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{b!.text}</Text>
      </View>
    ));

export function MyResumePDF({ data }: { data: any }) {
  const lang = (data.language || "en") as "en" | "fr";
  const titles = sectionTitles[lang];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName || "John Doe"}</Text>
          <Text style={styles.jobTitle}>{data.title || "Full Stack Developer"}</Text>

          <View style={styles.contactRow}>
            {data.email && (
              <Text style={styles.contactItem}>
                <Link src={`mailto:${data.email}`} style={styles.link}>
                  {data.email}
                </Link>
              </Text>
            )}

            {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}

            {data.linkedin && (
              <View style={styles.contactItemWithIcon}>
                <Svg width="10" height="10" viewBox="0 0 24 24" style={{ marginRight: 3 }}>
                  <Path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"
                    fill="#0A66C2"
                  />
                </Svg>
                <Link src={data.linkedin} style={styles.link}>
                  LinkedIn
                </Link>
              </View>
            )}
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View>
            <Text style={styles.sectionTitle}>{titles.summary}</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experiences?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{titles.experience}</Text>
            {data.experiences.map((exp: any, idx: number) => (
              <View key={exp.id ?? idx} style={styles.item}>
                <View style={styles.dateLocationRow}>
                  <Text style={styles.titleText}>{exp.role}</Text>
                  <Text>{exp.startDate} – {exp.endDate ?? "Present"}</Text>
                </View>
                <Text style={styles.secondaryText}>{exp.company}</Text>
                {renderBullets(exp.bullets)}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{titles.projects}</Text>
            {data.projects.map((proj: any, idx: number) => (
              <View key={proj.id ?? idx} style={styles.item}>
                <View style={styles.dateLocationRow}>
                  <Text style={styles.titleText}>{proj.title}</Text>
                  <Text>{proj.startDate} – {proj.endDate}</Text>
                </View>
                {renderBullets(proj.bullets)}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.educations?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{titles.education}</Text>
            {data.educations.map((edu: any, idx: number) => (
              <View key={edu.id ?? idx} style={styles.item}>
                <View style={styles.dateLocationRow}>
                  <Text style={styles.titleText}>{edu.degree}</Text>
                  <Text>{edu.startDate} – {edu.endDate}</Text>
                </View>
                <Text style={styles.secondaryText}>{edu.institution}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{titles.skills}</Text>
            <Text>
              {data.skills.map((s: any) => s.name).join(" • ")}
            </Text>
          </View>
        )}

        {/* Certificates */}
        {data.certificates?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{titles.certificates}</Text>
            {data.certificates.map((c: any, idx: number) => (
              <Text key={idx} style={styles.item}>
                <Text style={{ fontWeight: "bold" }}>{c.name}</Text>
                {c.issuer && ` – ${c.issuer}`}
              </Text>
            ))}
          </View>
        )}

        {/* Languages */}
        {data.languages?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>{titles.languages}</Text>
            <Text>
              {data.languages
                .map((l: any) =>
                  l.proficiency ? `${l.name} (${l.proficiency})` : l.name
                )
                .join(", ")}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

export default MyResumePDF;
