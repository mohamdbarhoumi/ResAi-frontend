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
    padding: 40, 
    fontSize: 12, 
    fontFamily: "Helvetica", 
    color: "#000" 
  },

  header: { 
    marginBottom: 16,          // reduced from 20 → tighter to next section
    textAlign: "center" 
  },

  name: { 
    fontSize: 29, 
    marginBottom: 4, 
    color: "#000" 
  },

  jobTitle: { 
    fontSize: 15, 
    marginBottom: 6,           // reduced from 8 → consistent with name
    color: "#000" 
  },

  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    fontSize: 11,
    marginTop: 4,              // reduced from 5 → tighter
  },

  contactItem: { 
    marginHorizontal: 10,      // increased from 8 → balanced spacing
    color: "#000" 
  },

  contactItemWithIcon: { 
    flexDirection: "row", 
    marginHorizontal: 10       // same as above
  },

  link: { 
    color: "#000", 
    textDecoration: "none" 
  },

  sectionTitle: {
    fontSize: 12,
    marginTop: 15,             // increased from 8 → clear section start
    marginBottom: 8,           // reduced from 12 → balanced with content
    paddingBottom: 4,
    borderBottom: "2 solid #000",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  summaryText: { 
    fontSize: 10, 
    lineHeight: 1.5, 
    textAlign: "justify", 
    color: " #000",
    marginBottom: 12           // added → space before next section
  },

  educationItem: { 
    marginBottom: 10           // reduced from 12 → consistent
  },

  degreeTitle: { 
    fontSize: 11, 
    marginBottom: 2, 
    color: "#000" 
  },

  universityName: { 
    fontSize: 10, 
    color: "#555", 
    marginBottom: 1            // reduced from 2 → tighter
  },

  dateLocation: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    fontSize: 9, 
    fontStyle: "italic", 
    color: "#666",
    marginBottom: 8            // added → space before next item
  },

  item: { 
    marginBottom: 14           // reduced from 15 → consistent
  },

  titleText: { 
    fontSize: 11, 
    marginBottom: 2, 
    color: "#000" 
  },

  secondaryText: { 
    fontSize: 10, 
    color: "#555", 
    marginBottom: 3            // increased from 1 → breathing room
  },

  dateLocationRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    fontSize: 9, 
    fontStyle: "italic", 
    color: "#666", 
    marginBottom: 6            // increased from 5 → consistent
  },

  bulletPoint: { 
    flexDirection: "row",
    marginBottom: 4,           // increased from 3 → better line spacing
    paddingLeft: 10 
  },

  bullet: { 
    width: 15, 
    fontSize: 10 
  },
  bulletText: { 
    flex: 1, 
    fontSize: 10, 
    lineHeight: 1.4 
  },

  skillsContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    marginTop: 6               // increased from 5 → align with section rhythm
  },

  skillBadge: { 
    backgroundColor: "#f0f0f0", 
    paddingHorizontal: 9,      // reduced from 10 → tighter
    paddingVertical: 4,        // reduced from 5 → tighter
    marginRight: 8, 
    marginBottom: 6,           // reduced from 8 → consistent
    borderRadius: 3, 
    fontSize: 9
  },

});

const renderBullets = (bullets: any[] = []) =>
  bullets
    .map((b) => (b ? { text: b.text?.trim() ?? "" } : null))
    .filter(Boolean)
    .map((b, i) => (
      <View key={`bullet-${i}`} style={styles.bulletPoint}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{b!.text}</Text>
      </View>
    ));

export function MyResumePDF({ data }: { data: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
         {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName || "John Doe"}</Text>
          <Text style={styles.jobTitle}>
            {data.title || "Full Stack Web Developer"}
          </Text>

          <View style={styles.contactRow}>
            {data.email && (
              <Link
                src={`mailto:${data.email}`}
                style={[styles.contactItem, styles.link]}
              >
                {data.email}
              </Link>
            )}
            {data.phone && (
              <Text style={styles.contactItem}> {data.phone}</Text>
            )}
            {data.linkedin && (
              <Link src={data.linkedin} style={styles.link}>
                <View style={styles.contactItemWithIcon}>
                  <Svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    style={{ marginRight: 4 }}
                  >
                    <Path
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                      fill="#0A66C2"
                    />
                  </Svg>
                  <Text>LinkedIn</Text>
                </View>
              </Link>
            )}
            {data.github && (
              <View style={styles.contactItemWithIcon}>
                <Svg width="12" height="12" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                  <Path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    fill="#181717"
                  />
                </Svg>
                <Link src={data.github} style={styles.link}>
                  <Text>GitHub</Text>
                </Link>
              </View>
            )}
            {data.location && (
              <Text style={styles.contactItem}>{data.location}</Text>
            )}
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View>
            <Text style={styles.sectionTitle}>SUMMARY</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experiences?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>EXPERIENCE</Text>
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
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {data.projects.map((proj: any, idx: number) => (
              <View key={proj.id ?? idx} style={styles.item}>
                <View style={styles.dateLocationRow}>
                  <Text style={styles.titleText}>{proj.title}</Text>
                  <Text>{proj.startDate ?? ""} – {proj.endDate ?? ""}</Text>
                </View>
                {proj.tech?.length > 0 && <Text style={styles.secondaryText}>{proj.tech.join(", ")}</Text>}
                {renderBullets(proj.bullets)}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
{data.educations?.length > 0 && (
  <View>
    <Text style={styles.sectionTitle}>EDUCATION</Text>
    {data.educations.map((edu: any, idx: number) => (
      <View key={edu.id ?? idx} style={styles.item}> 
        <View style={styles.dateLocationRow}> 
          <Text style={styles.titleText}>{edu.degree}</Text>
          <Text>{edu.startDate} – {edu.endDate ?? "Present"}</Text>
        </View>
        <Text style={styles.secondaryText}>
          {edu.institution}
          {edu.location ? `, ${edu.location}` : ""}
        </Text> 
      </View>
    ))}
  </View>
)}

        {/* Skills Section */}
    {data.skills && data.skills.length > 0 && (
      <View>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Text>
          {data.skills.map(s => `• ${s.name}`).join("   ")}
        </Text>
      </View>
    )}

    {/* Certificates */}
        {data.certificates.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Certificates</Text>
            {data.certificates.map((c) => (
              <Text key={c.id} style={styles.item}>
                <Text style={{ fontWeight: "bold" }}>{c.name}</Text>
                {c.issuer && `, ${c.issuer}`}
                {c.date && ` (${c.date})`}
              </Text>
            ))}
          </View>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text>
              {data.languages
                .map((l) => (l.proficiency ? `${l.name} (${l.proficiency})` : l.name))
                .join(", ")}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

export default MyResumePDF;