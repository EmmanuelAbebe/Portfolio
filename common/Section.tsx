import { ReactNode } from "react";

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="min-h-svh snap-start flex place-items-center px-4"
    >
      <div className="w-full py-8">
        <h2 className="font-mono text-3xl font-bold mb-20">{title}</h2>
        {children}
      </div>
    </section>
  );
}
