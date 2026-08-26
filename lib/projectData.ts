// import { Project } from "@/common/ProjectCard";

import { Project } from "@/types";

// lib/projectData.ts

export const projects: Project[] = [
  {
    slug: "salon-booking",
    title: "Booking & Management System",
    oneLiner:
      "Role-based booking, schedules, and stylist galleries in one app.",
    stack: [
      "Next.js (App Router)",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "RBAC",
    ],
    highlights: [
      "Built admin/stylist/customer dashboards with RBAC-protected routes.",
      "Prevented double-bookings via server-side conflict checks.",
      "Unified booking + gallery + management into a single deployable app.",
    ],
    links: {
      demo: "https://example.com",
      repo: "https://github.com/you/salon-booking",
    },
    details: {
      problem:
        "Salon needed a single system for bookings, galleries, and role-separated workflows.",
      architecture:
        "Server actions for mutations, Prisma for data layer, PostgreSQL schema enforcing consistency.",
      decisions: [
        "Chose Next.js to consolidate FE/BE and deployment.",
        "Added RBAC early to avoid privilege leakage during feature growth.",
      ],
    },
    media: { thumbnail: "/images/salon.png" },
  },

  {
    slug: "Reservation-App",
    title: "Reservation Web App",
    oneLiner: "A brief description of project two.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    highlights: [
      "Modern UI/UX design for seamless user experience.",
      "Form validation and error handling implemented.",
      "Admin dashboard for managing reservations.",
    ],
    links: {
      demo: "https://studio-reservation-seven.vercel.app/",
      repo: "https://github.com/EmmanuelAbebe/StudioReservation/",
    },
    details: {
      problem: "Reserve a time and space efficiently.",
      architecture: "frontend with Next.js and backend integration.",
      decisions: [
        "utilizing Prisma for data modeling",
        "chose Next.js for SSR.",
      ],
    },
    media: { thumbnail: "/images/project2.png" },
  },
  {
    slug: "AI Chess app",
    title: "AI Chess app",
    oneLiner: "An AI-powered chess application with real-time gameplay.",
    stack: ["React", "TypeScript", "Node.js", "TensorFlow.js"],
    highlights: [
      "Implemented AI opponent with neural network training.",
      "Built real-time multiplayer chess experience.",
      "Integrated responsive UI with smooth animations.",
    ],
    links: {
      demo: "https://chessapp-five.vercel.app/",
      repo: "https://github.com/EmmanuelAbebe/chessapp",
    },
    details: {
      problem: "Create an engaging chess experience with intelligent AI.",
      architecture:
        "Frontend with React and TypeScript, backend with Node.js and TensorFlow.js.",
      decisions: [
        "Chose React for its component-based architecture.",
        "Utilized TensorFlow.js for on-device machine learning.",
      ],
    },
    media: { thumbnail: "/images/ai-chess.png" },
  },
];

// export const projectData: Project[] = [
//   {
//     thumbnail: null,
//     title: "Full-Stack Booking & Management System",
//     description: {
//       problemStatement: (
//         <p>
//           A hair salon required a centralized system to manage customer
//           bookings, showcase stylist work, and handle appointment operations
//           securely. Existing tools were fragmented, manual, and did not support
//           role-based workflows for staff versus administrators.
//         </p>
//       ),

//       techstack: (
//         <ul className="list-disc pl-5">
//           <li>Next.js (App Router)</li>
//           <li>React + TypeScript</li>
//           <li>Prisma ORM</li>
//           <li>PostgreSQL</li>
//           <li>Server Actions / API Routes</li>
//           <li>Authentication & RBAC</li>
//         </ul>
//       ),

//       architecture: (
//         <p>
//           The application follows a full-stack Next.js architecture with server
//           components handling data fetching and mutations. Prisma acts as the
//           data access layer between the application and PostgreSQL.
//           Authentication and role-based access control gate dashboard routes,
//           separating admin, stylist, and customer permissions. Public-facing
//           pages render stylist galleries and availability, while protected
//           dashboards manage bookings and schedules.
//         </p>
//       ),

//       decisions: (
//         <p>
//           Next.js was chosen to unify frontend and backend concerns and reduce
//           deployment complexity. Prisma was selected for type-safe database
//           access and schema migrations. Role-based access control was
//           implemented early to prevent privilege leakage as features scaled. The
//           data model prioritizes appointment consistency and conflict prevention
//           over flexibility.
//         </p>
//       ),
//     },
//     githubLink: "repo-name-1",
//     demolink: "https://example.com",
//   },
//   {
//     thumbnail: null,
//     title: "project-2",
//     description: {
//       problemStatement: "content here",
//       techstack: "content here",
//       architecture: "content here",
//       decisions: "content here",
//     },
//     githubLink: "repo-name-2",
//     demolink: "https://example.com",
//   },
//   {
//     thumbnail: null,
//     title: "project-3",
//     description: {
//       problemStatement: "content here",
//       techstack: "content here",
//       architecture: "content here",
//       decisions: "content here",
//     },
//     githubLink: "repo-name-3",
//     demolink: "https://example.com",
//   },
// ];
