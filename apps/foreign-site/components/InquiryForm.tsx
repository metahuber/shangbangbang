"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "ok" | "error";

export default function InquiryForm({
  productName,
  productSlug,
  compact = false,
}: {
  /** 从产品页发起时带上，询盘会记录来自哪个产品 */
  productName?: string;
  productSlug?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      country: String(fd.get("country") ?? "").trim(),
      quantity: String(fd.get("quantity") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      productSlug: productSlug ?? "",
      productName: productName ?? "",
    };

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to send");
      setStatus("ok");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to send");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <p className="text-base font-bold text-green-800">
          Thank you — your inquiry has been sent.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-green-700">
          Our export team will reply within 12 working hours. For anything
          urgent, please message us on WhatsApp.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100";
  const labelClass = "mb-1.5 block text-xs font-semibold text-slate-700";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      {productName && (
        <div className="mb-5 rounded border border-brand-100 bg-brand-50 px-4 py-3 text-sm">
          <span className="text-slate-600">Inquiring about: </span>
          <span className="font-semibold text-brand-800">{productName}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="iq-name" className={labelClass}>
            Your name <span className="text-red-500">*</span>
          </label>
          <input
            id="iq-name"
            name="name"
            required
            maxLength={60}
            placeholder="John Smith"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="iq-email" className={labelClass}>
            Business email <span className="text-red-500">*</span>
          </label>
          <input
            id="iq-email"
            name="email"
            type="email"
            required
            maxLength={120}
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="iq-company" className={labelClass}>
            Company
          </label>
          <input
            id="iq-company"
            name="company"
            maxLength={120}
            placeholder="ABC Trading Ltd."
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="iq-country" className={labelClass}>
            Country
          </label>
          <input
            id="iq-country"
            name="country"
            maxLength={60}
            placeholder="Germany"
            className={inputClass}
          />
        </div>

        {!compact && (
          <div className="sm:col-span-2">
            <label htmlFor="iq-quantity" className={labelClass}>
              Quantity / target price
            </label>
            <input
              id="iq-quantity"
              name="quantity"
              maxLength={120}
              placeholder="e.g. 2,000 pcs, or your target FOB price"
              className={inputClass}
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="iq-message" className={labelClass}>
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="iq-message"
            name="message"
            required
            rows={compact ? 3 : 4}
            maxLength={2000}
            placeholder="Tell us what you need — item, size, packaging, destination port."
            className={`${inputClass} resize-y`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 w-full rounded bg-accent-500 px-5 py-3.5 text-base font-bold text-white shadow-sm transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Inquiry"}
      </button>

      <p className="mt-3 text-center text-xs text-slate-500">
        We reply within 12 working hours. Your details are never shared with
        third parties.
      </p>

      {status === "error" && (
        <p className="mt-3 text-center text-sm text-red-600">
          {error}. Please email us directly or use WhatsApp.
        </p>
      )}
    </form>
  );
}
