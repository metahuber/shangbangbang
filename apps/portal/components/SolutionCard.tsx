import Link from "next/link";
import type { Solution } from "@/content/solutions";

export default function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
    >
      <span className="text-2xl">{solution.emoji}</span>
      <span className="flex-1">
        <span className="block text-base font-bold text-slate-900 group-hover:text-brand-700">
          {solution.name}
        </span>
        <span className="mt-1 block text-sm text-slate-600">
          {solution.shortDesc}
        </span>
      </span>
      <span className="mt-1 text-brand-500">→</span>
    </Link>
  );
}
