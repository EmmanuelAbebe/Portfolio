import clsx from "clsx";
import { BsPersonWorkspace } from "react-icons/bs";
import { FaFile, FaCode } from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";
import { Link } from "react-aria-components";

export type SectionId = "about" | "projects" | "resume" | "contacts";

export type NavSection = { id: SectionId; label: string };

type Props = {
  active: SectionId;
  sections: NavSection[];
  onNav: (id: SectionId) => void;
};

export default function SiteHeader({ active, sections, onNav }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-white/10 backdrop-blur px-8 pt-4 md:px-30 md:pt-10">
      <div className="border-b pb-3">
        <div className="flex items-end justify-between">
          <div
            className={`flex items-baseline gap-2 transition-all duration-300 delay-100 ${
              active != "about" ? "flex-row" : "flex-col"
            }`}
          >
            <p
              className={`font-mono uppercase transition-all duration-300 delay-100 ${
                active != "about"
                  ? "text-[14px] font-semibold"
                  : "text-4xl font-bold "
              }`}
            >
              Emmanuel&middot;Abebe
            </p>
            <span
              className={`transition-all duration-300 delay-100 ${
                active != "about" ? "" : "hidden"
              }`}
            >
              &mdash;
            </span>
            <p className="font-mono text-xs lg:text-sm transition-all duration-300 delay-100">
              Junior Software Engineer&middot;React&middot;Next.js
            </p>
          </div>
        </div>

        <nav className="font-mono text-sm flex items-center gap-3 mt-5">
          {sections.map((s, i) => (
            <span key={s.id} className="flex items-center gap-0.5">
              <Link
                href={`#${s.id}`}
                aria-current={active === s.id ? "page" : undefined}
                className={clsx(
                  "flex items-center gap-1 hover:underline",
                  active === s.id &&
                    "underline font-semibold text-indigo-600/90"
                )}
                onPress={(e) => {
                  //   e.preventDefault(); // stop default hash navigation
                  onNav(s.id);
                }}
              >
                {s.id === "about" && <BsPersonWorkspace size={14} />}
                {s.id === "projects" && <FaCode size={14} />}
                {s.id === "resume" && <FaFile size={14} />}
                {s.id === "contacts" && <LuMessageSquare size={14} />}
                {s.label}
              </Link>

              {i !== sections.length - 1 && (
                <span className="opacity-50">/</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
}
