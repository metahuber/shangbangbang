import Link from "next/link";
import { products } from "@/content/products";
import { solutions } from "@/content/solutions";
import { site, TBD } from "@/content/site";

function isTbd(v: string) {
  return v === TBD;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* 品牌 */}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-base font-bold text-white">
                商
              </span>
              <span className="text-base font-bold text-slate-900">
                {site.name}
              </span>
            </div>
            <p className="mt-3 text-sm font-medium text-slate-700">
              {site.tagline}
            </p>
            <p className="mt-2 text-sm text-slate-500">{site.slogan}</p>

            <div className="mt-4 space-y-1 text-sm text-slate-600">
              {!isTbd(site.phone) ? (
                <p>
                  电话：
                  <a href={`tel:${site.phone}`} className="hover:text-brand-700">
                    {site.phone}
                  </a>
                </p>
              ) : (
                <p className="text-slate-400">电话：待填写</p>
              )}
              {!isTbd(site.email) ? (
                <p>
                  邮箱：
                  <a
                    href={`mailto:${site.email}`}
                    className="hover:text-brand-700"
                  >
                    {site.email}
                  </a>
                </p>
              ) : (
                <p className="text-slate-400">邮箱：待填写</p>
              )}
            </div>
          </div>

          {/* 产品 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">产品</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="text-slate-600 hover:text-brand-700"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 解决方案 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">解决方案</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {solutions.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/solutions/${s.slug}`}
                    className="text-slate-600 hover:text-brand-700"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 其他 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">关于</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                ["/cases", "客户案例"],
                ["/pricing", "价格"],
                ["/faq", "常见问题"],
                ["/about", "关于我们"],
                ["/contact", "联系我们"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-600 hover:text-brand-700"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 底部条 */}
        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {isTbd(site.companyName) ? site.name : site.companyName} ·
            保留所有权利
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {isTbd(site.icp) ? (
              <span className="text-slate-400">ICP 备案号：备案通过后填写</span>
            ) : (
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-brand-700"
              >
                {site.icp}
              </a>
            )}
            <Link href="/privacy" className="hover:text-brand-700">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-brand-700">
              服务条款
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
