import { Project } from "@/common/ProjectCard";

export const projectData: Project[] = [
  {
    thumbnail: null,
    title: "Full-Stack Booking & Management System",
    description: {
      problemStatement: (
        <p>
          A hair salon required a centralized system to manage customer
          bookings, showcase stylist work, and handle appointment operations
          securely. Existing tools were fragmented, manual, and did not support
          role-based workflows for staff versus administrators.
        </p>
      ),

      techstack: (
        <ul className="list-disc pl-5">
          <li>Next.js (App Router)</li>
          <li>React + TypeScript</li>
          <li>Prisma ORM</li>
          <li>PostgreSQL</li>
          <li>Server Actions / API Routes</li>
          <li>Authentication & RBAC</li>
        </ul>
      ),

      architecture: (
        <p>
          The application follows a full-stack Next.js architecture with server
          components handling data fetching and mutations. Prisma acts as the
          data access layer between the application and PostgreSQL.
          Authentication and role-based access control gate dashboard routes,
          separating admin, stylist, and customer permissions. Public-facing
          pages render stylist galleries and availability, while protected
          dashboards manage bookings and schedules.
        </p>
      ),

      decisions: (
        <p>
          Next.js was chosen to unify frontend and backend concerns and reduce
          deployment complexity. Prisma was selected for type-safe database
          access and schema migrations. Role-based access control was
          implemented early to prevent privilege leakage as features scaled. The
          data model prioritizes appointment consistency and conflict prevention
          over flexibility.
        </p>
      ),
    },
    githubLink: "repo-name-1",
    demolink: "https://example.com",
  },
  {
    thumbnail: null,
    title: "project-2",
    description: {
      problemStatement: "content here",
      techstack: "content here",
      architecture: "content here",
      decisions: "content here",
    },
    githubLink: "repo-name-2",
    demolink: "https://example.com",
  },
  {
    thumbnail: null,
    title: "project-3",
    description: {
      problemStatement: "content here",
      techstack: "content here",
      architecture: "content here",
      decisions: "content here",
    },
    githubLink: "repo-name-3",
    demolink: "https://example.com",
  },
];
