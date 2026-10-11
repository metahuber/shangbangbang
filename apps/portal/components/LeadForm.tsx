"use client";

import { useState } from "react";
import { leadForm } from "@/content/leadForm";
import { sortedProducts } from "@/content/products";

type Status = "idle" | "submitting" | "ok" | "error";

/** 下拉选项自动来自产品列表——加了新产品，表单里就自动多一项 */
const interests: string[] = [
  ...sortedProducts().map((p) => p.name),
  leadForm.interest.fallbackOption,
];

export default function LeadForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      contact: String(fd.get("contact") ?? "").trim(),
      interest: String(fd.get("interest") ?? "").trim(),
      note: String(fd.get("note") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "提交失败");
      }
      setStatus("ok");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "提交失败");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6">
        <p className="text-base font-semibold text-green-800">
          {leadForm.success.title}
        </p>
        <p className="mt-2 text-sm text-green-700">{leadForm.success.desc}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4">
        <div>
          <label
            htmlFor="lead-name"
            className="mb-1.5 block text-sm font-medium text-slate-800"
          >
            {leadForm.name.label} <span className="text-red-500">*</span>
          </label>
          <input
            id="lead-name"
            name="name"
            required
            maxLength={40}
            placeholder={leadForm.name.placeholder}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label
            htmlFor="lead-contact"
            className="mb-1.5 block text-sm font-medium text-slate-800"
          >
            {leadForm.contact.label} <span className="text-red-500">*</span>
          </label>
          <input
            id="lead-contact"
            name="contact"
            required
            maxLength={60}
            placeholder={leadForm.contact.placeholder}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            {leadForm.contact.hint}
          </p>
        </div>

        <div>
          <label
            htmlFor="lead-interest"
            className="mb-1.5 block text-sm font-medium text-slate-800"
          >
            {leadForm.interest.label} <span className="text-red-500">*</span>
          </label>
          <select
            id="lead-interest"
            name="interest"
            required
            defaultValue={interests[0]}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            {interests.map((it) => (
              <option key={it} value={it}>
                {it}
              </option>
            ))}
          </select>
        </div>

        {!compact && (
          <div>
            <label
              htmlFor="lead-note"
              className="mb-1.5 block text-sm font-medium text-slate-800"
            >
              {leadForm.note.label}{" "}
              <span className="text-slate-400">{leadForm.note.optional}</span>
            </label>
            <textarea
              id="lead-note"
              name="note"
              rows={3}
              maxLength={500}
              placeholder={leadForm.note.placeholder}
              className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-lg bg-accent-500 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? leadForm.submitting : leadForm.submit}
        </button>

        {status === "error" && (
          <p className="text-sm text-red-600">
            {error}
            {leadForm.errorSuffix}
          </p>
        )}
      </div>
    </form>
  );
}
