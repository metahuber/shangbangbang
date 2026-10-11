# 图片素材放这里

## 待上传

| 文件名 | 用途 | 规格建议 |
|---|---|---|
| `wechat-qr.png` | 联系页与页脚的微信二维码 | 正方形，≥ 500×500px |
| `og-cover.png` | 社交分享封面 | 1200×630px |
| `logo.svg` | 如果要做品牌 Logo | 矢量 |

## 上传微信二维码后

打开 `app/contact/page.tsx`，把二维码占位块替换成：

```tsx
<img
  src="/images/wechat-qr.png"
  alt="商帮帮微信二维码"
  width={140}
  height={140}
  className="rounded-lg border border-slate-200"
/>
```

同时在 `components/Footer.tsx` 的二维码位置加上同一张图。

> Next.js 如果直接用 `<img>` 会有 lint 提示；量少时用 `<img>` 完全没问题，
> 要优化可以换成 `next/image`。
