/**
 * 图片
 *
 * 后台没上传图片时显示斜纹占位块（并标出建议尺寸）；
 * 上传了就显示真实图片。
 *
 * 用途：让老板知道「这里该放什么图」，而不是看到一堆灰块。
 */

export default function Photo({
  caption,
  src,
  alt,
  className = "",
  ratio = "aspect-[4/3]",
  dark = false,
}: {
  /** 说明这个位置以后放什么图，以及建议尺寸 */
  caption: string;
  /** 后台媒体库里图片的地址 */
  src?: string | null;
  alt?: string;
  className?: string;
  /** Tailwind 的 aspect 类，例如 aspect-[16/9] */
  ratio?: string;
  dark?: boolean;
}) {
  const hasImage = Boolean(src);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${ratio} ${
        hasImage ? "bg-slate-100" : "photo-placeholder"
      } ${className}`}
      role="img"
      aria-label={alt || `Placeholder: ${caption}`}
    >
      {hasImage ? (
        // 用原生 img：媒体库已生成多档尺寸，量少时不需要 next/image 的复杂度
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src as string}
          alt={alt || caption}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className={`flex flex-col items-center gap-1.5 px-4 text-center ${
            dark ? "text-slate-500" : "text-slate-400"
          }`}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="10" r="1.5" />
            <path d="M21 16l-5-5-4 4-2-2-4 4" />
          </svg>
          <span className="text-[11px] font-medium leading-tight">
            {caption}
          </span>
        </div>
      )}
    </div>
  );
}
