export const profile = {
  name: "Thaveesha Thilan Sonnadara",
  preferredName: "Thaveesha",
  email: "sonnadarathaveesha@gmail.com",
  phone: "+94 70 353 4142",
  location: "Mount Lavinia, Colombo, Sri Lanka",
  address: "7/8, Vidyala Road, Templers Road, Mount Lavinia, Colombo, Sri Lanka",
  dob: "23 December 2002",
  linkedin: "https://www.linkedin.com/in/thaveeshasonnadara/",
  github: "https://github.com/ThaveeshaSonnadara",
  availability: "Immediately available — no notice period required",
  targetRoles: ["Associate Software Engineer", "Software Engineer", "Intern Software Engineer"],

  about: `I am a Software Engineering graduate with a completed BEng (Hons) in Software Engineering from the Informatics Institute of Technology (IIT), affiliated with the University of Westminster. I have practical experience in software development through industry experience and personal projects, with a strong focus on modern web technologies, including React, Next.js, TypeScript, and Node.js. I am a self-motivated and adaptable engineer who enjoys solving problems, learning new technologies, and building reliable, user-focused software.`,

  education: [
    {
      degree: "BEng (Hons) Software Engineering with Industrial Placement",
      institution: "Informatics Institute of Technology (IIT), affiliated with University of Westminster, UK",
      awardClass: "Upper Second Class Honours",
      period: "January 2023 – August 2026",
      awardDate: "6 August 2026",
      convocation: "November 2026",
      school: "Computer Science and Engineering",
      college: "Creative Arts and Technologies",
    },
    {
      degree: "GCE Advanced Level - Physical Science (Combined Mathematics)",
      institution: "Thurstan College, Colombo",
      period: "December 2019 – February 2022",
    },
  ],

  workExperience: [
    {
      role: "Intern Software Engineer",
      company: "MarketPushApps",
      period: "September 2024 – September 2025",
      location: "Romania (Remote)",
      responsibilities: [
        "Web application development using ReactJS",
        "Built and maintained frontend components while integrating REST APIs",
        "Followed designs accurately using Figma and implemented them with Figma MCP and Design System MCP in VS Code",
        "Tested and documented APIs with Postman and Swagger",
        "Managed code through GitHub to deliver production-ready features",
      ],
    },
  ],

  projects: [
    {
      name: "Room ODD — Architectural Firm Website",
      tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion", "Resend"],
      year: 2026,
      description: "Full-stack architectural consultancy platform featuring editorial design aesthetics, 13 dynamic routes, multi-category portfolio filtering, and validated consultation booking workflows.",
      github: "https://github.com/ThaveeshaSonnadara/room-odd-website",
    },
    {
      name: "Final Year Project (FYP)",
      tech: ["Python"],
      year: 2026,
      description: "University final year research project.",
      github: "https://github.com/ThaveeshaSonnadara/FYP-Project",
    },
    {
      name: "ToDo WebApp",
      tech: ["EJS", "Node.js"],
      year: 2026,
      description: "Web-based task management application. MIT Licensed.",
      github: "https://github.com/ThaveeshaSonnadara/ToDo-WebApp",
    },
    {
      name: "Typing Effect — React Component",
      tech: ["React", "TypeScript"],
      year: 2025,
      description: "Developed a custom React component to animate web titles using react-simple-typewriter, featuring multiple style templates and reusable hooks.",
    },
    {
      name: "CaseCobra — Custom Mobile Cover Ordering Platform",
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Shadcn UI"],
      year: 2024,
      description: "Personal project built with Next.js & TypeScript to create a custom mobile cover ordering platform. Gained hands-on experience with Shadcn UI, React hooks, and modern UI development.",
      github: "https://github.com/ThaveeshaSonnadara/casecobra-CloneProject",
    },
    {
      name: "ViprWatch — Snake Identification App",
      tech: ["Flutter", "Firebase", "Machine Learning", "AWS", "Python", "Flask"],
      year: 2024,
      description: "Mobile application for snake identification using machine learning. Led the team and followed full SDLC practices in a production-level project. Built separate Flask APIs for ML model prediction and backend integration.",
      github: "https://github.com/ThaveeshaSonnadara/vipr_watch_mobile_application",
      role: "Team Lead",
    },
    {
      name: "Cashier System — Foodies Fave Food Center",
      tech: ["Java", "JavaFX"],
      year: 2024,
      description: "GUI application for a burger shop cashier system built with Java and JavaFX.",
      github: "https://github.com/ThaveeshaSonnadara/Cashier-System-2023",
    },
    {
      name: "Pixilla — Web Gaming Application",
      tech: ["HTML", "CSS", "JavaScript"],
      year: 2023,
      description: "Web-based gaming application built to gain hands-on experience in frontend web development.",
      github: "https://github.com/ThaveeshaSonnadara/ThaveeshaSonnadara.github.io",
    },
    {
      name: "Online Shopping System",
      tech: ["Java"],
      year: 2023,
      description: "E-commerce system built with Java.",
      github: "https://github.com/ThaveeshaSonnadara/OnlineShoppingSystem",
    },
    {
      name: "Academic Progression Predictor",
      tech: ["Python"],
      year: 2023,
      description: "First year IIT coursework — predicting academic progression outcomes using Python.",
      github: "https://github.com/ThaveeshaSonnadara/Predict-Academic-Progression-Outcomes-2023",
    },
  ],

  techSkills: {
    languages: ["TypeScript", "JavaScript", "Python", "Java", "Dart", "HTML", "CSS"],
    frameworks: ["Next.js", "React", "Node.js", "Flutter", "JavaFX", "Flask", "EJS"],
    styling: ["Tailwind CSS", "Vanilla CSS", "Framer Motion", "Shadcn UI"],
    databases: ["MongoDB", "Firebase"],
    cloud: ["AWS"],
    tools: ["VS Code", "Antigravity", "Google Colab", "Figma", "Swagger", "Postman", "Slack", "GitHub"],
    ai: ["Machine Learning", "Claude Code", "MCP Servers"],
  },

  softSkills: ["Strong Work Ethic", "Interpersonal Skills", "Time Management", "Adaptive Learning", "Team Work"],

  githubStats: {
    repos: 11,
    stars: 3,
    achievements: ["Pull Shark x2", "GitHub Pro"],
  },
};

export function getProfileSummary(): string {
  return `
Name: ${profile.name}
Location: ${profile.location}
Email: ${profile.email}
Phone: ${profile.phone}

ABOUT:
${profile.about}

EDUCATION:
- ${profile.education[0].degree} — ${profile.education[0].awardClass}
  ${profile.education[0].institution}
  Period: ${profile.education[0].period} | Awarded: ${profile.education[0].awardDate}
- ${profile.education[1].degree}
  ${profile.education[1].institution}
  Period: ${profile.education[1].period}

WORK EXPERIENCE:
- ${profile.workExperience[0].role} at ${profile.workExperience[0].company} (${profile.workExperience[0].period})
  Location: ${profile.workExperience[0].location}
  ${profile.workExperience[0].responsibilities.map(r => `  • ${r}`).join('\n')}

PROJECTS:
${profile.projects.map(p => `- ${p.name} (${p.year}) — ${p.tech.join(', ')}\n  ${p.description}`).join('\n')}

TECHNICAL SKILLS:
- Languages: ${profile.techSkills.languages.join(', ')}
- Frameworks: ${profile.techSkills.frameworks.join(', ')}
- Styling: ${profile.techSkills.styling.join(', ')}
- Databases: ${profile.techSkills.databases.join(', ')}
- Cloud: ${profile.techSkills.cloud.join(', ')}
- Tools: ${profile.techSkills.tools.join(', ')}
- AI/ML: ${profile.techSkills.ai.join(', ')}

SOFT SKILLS: ${profile.softSkills.join(', ')}

AVAILABILITY: ${profile.availability}
TARGET ROLES: ${profile.targetRoles.join(', ')}

LinkedIn: ${profile.linkedin}
GitHub: ${profile.github}
  `.trim();
}
