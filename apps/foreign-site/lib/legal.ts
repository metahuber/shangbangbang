/**
 * 隐私政策 / 服务条款（模板）
 *
 * ⚠️ 这是**模板草稿**，不是法律文件。
 *    每个客户的站点会渲染成他自己的公司名，但条款本身必须经专业顾问审核。
 *
 * 占位符会在渲染时替换：
 *   {{company}}  客户公司全称
 *   {{site}}     站点域名
 *   {{email}}    客户联系邮箱
 */

export type LegalSection = {
  title: string;
  paras?: string[];
  list?: string[];
};

export type LegalVars = {
  company: string;
  site: string;
  email: string;
};

function fill(text: string, v: LegalVars): string {
  return text
    .replaceAll("{{company}}", v.company)
    .replaceAll("{{site}}", v.site)
    .replaceAll("{{email}}", v.email);
}

function apply(sections: LegalSection[], v: LegalVars): LegalSection[] {
  return sections.map((s) => ({
    title: s.title,
    paras: s.paras?.map((p) => fill(p, v)),
    list: s.list?.map((p) => fill(p, v)),
  }));
}

const PRIVACY: LegalSection[] = [
  {
    title: "1. What we collect",
    paras: [
      "We only collect the information you give us yourself: your name, business email address, company, country, the quantity or target price you enter, and the message you send us.",
      "We also collect standard technical information automatically when you visit this site, such as your approximate location, browser type and the pages you viewed. This is used to understand how the site is used and to improve it.",
    ],
  },
  {
    title: "2. Why we use it",
    paras: [
      "To reply to your enquiry, prepare a quotation, and provide the samples or products you ask about. We do not use your information for any purpose unrelated to your enquiry.",
    ],
  },
  {
    title: "3. Cookies and analytics",
    paras: [
      "This site uses cookies. Essential cookies are required for the site to work. Analytics cookies are only set if you accept them through the consent banner — if you decline, no analytics cookies are set.",
      "We use Google Analytics 4 to understand which pages are useful. It records anonymised, aggregated statistics. You can decline analytics cookies at any time and the site will still work normally.",
    ],
    list: [
      "Essential cookies — required for the site to function",
      "Analytics cookies — set only with your consent, used for aggregated traffic statistics",
      "Chat widget cookies — set when the live chat is loaded so that a conversation can continue across pages",
    ],
  },
  {
    title: "4. Who we share it with",
    paras: [
      "We do not sell, rent or trade your information. We share it only with service providers that help us run this site and communicate with you (for example our email provider, our website host, and the live chat provider). These providers process the data on our instructions only.",
      "We may disclose information if we are legally required to do so.",
    ],
  },
  {
    title: "5. International transfers",
    paras: [
      "Some of the service providers above store data outside your country. Where that happens, we rely on standard contractual clauses or equivalent safeguards.",
    ],
  },
  {
    title: "6. How long we keep it",
    paras: [
      "Enquiry records are kept for as long as needed to serve you as a customer or prospective customer, and for the period required by applicable tax and commercial law. After that they are deleted or anonymised.",
    ],
  },
  {
    title: "7. Your rights",
    paras: ["Depending on where you live, you may have the right to:"],
    list: [
      "Ask for a copy of the personal data we hold about you",
      "Ask us to correct inaccurate data",
      "Ask us to delete your data",
      "Object to or restrict certain processing",
      "Withdraw consent for analytics cookies at any time (clear your browser storage for this site)",
      "Lodge a complaint with your local data protection authority",
    ],
  },
  {
    title: "8. Security",
    paras: [
      "We use reasonable technical and organisational measures to protect your information, including encrypted transport (HTTPS), access controls and regular backups. No method of transmission over the internet is completely secure, so we cannot guarantee absolute security.",
    ],
  },
  {
    title: "9. Contact",
    paras: [
      "This site is operated by {{company}}. For any privacy question, or to exercise your rights, contact us at {{email}} or through the contact form on this site.",
    ],
  },
];

const TERMS: LegalSection[] = [
  {
    title: "1. About these terms",
    paras: [
      "This website is operated by {{company}} at {{site}}. By using this site and by sending us an enquiry, you agree to these terms.",
    ],
  },
  {
    title: "2. Information on this site",
    paras: [
      "We aim to describe our products and capabilities accurately. Product specifications, packaging, lead times and certifications shown on this site are indicative and may change. The binding terms are those written in the quotation and the sales contract we sign with you.",
      "Photographs and videos are for illustration. Dimensions and appearance of the delivered goods follow the agreed drawing or sample.",
    ],
  },
  {
    title: "3. Enquiries and quotations",
    paras: [
      "An enquiry submitted through this site is a request for information, not a binding order. A quotation becomes binding only when both parties have confirmed it in writing (including by email or a signed proforma invoice).",
    ],
  },
  {
    title: "4. Samples",
    paras: [
      "Samples are provided as described in the quotation. Where samples are offered free of charge, the courier cost is normally paid by the buyer and may be credited against a subsequent order.",
    ],
  },
  {
    title: "5. Orders, price and payment",
    paras: [
      "Prices, quantities, delivery terms and payment methods are those stated in the confirmed quotation or proforma invoice. Unless agreed otherwise, payment terms are a deposit before production and the balance against a copy of the bill of lading.",
      "Third-party costs such as bank charges, customs duties and local taxes are payable by the buyer unless the quotation says otherwise.",
    ],
  },
  {
    title: "6. Delivery and risk",
    paras: [
      "Delivery times are estimates and start from the date we receive your deposit and your final artwork or specification approval. Risk passes according to the Incoterm stated in the quotation.",
    ],
  },
  {
    title: "7. Warranty and claims",
    paras: [
      "We warrant that the goods conform to the agreed specification. If they do not, tell us within the period stated in the contract with evidence (photographs, inspection report). Our obligation is limited to repair, replacement or credit of the affected goods.",
    ],
  },
  {
    title: "8. Intellectual property",
    paras: [
      "Your drawings, brands and logos remain yours. We use them only to produce your order. Our own site content, photographs and product descriptions may not be copied for commercial use without our written permission.",
    ],
  },
  {
    title: "9. Limitation of liability",
    paras: [
      "To the extent permitted by law, our total liability arising out of or in connection with a contract is limited to the value of the goods supplied under that contract. We are not liable for indirect or consequential loss, including lost profit.",
    ],
  },
  {
    title: "10. Governing law",
    paras: [
      "These terms and any contract between us are governed by the laws of the People's Republic of China, unless the contract states otherwise. The parties will first try to settle any dispute amicably.",
    ],
  },
  {
    title: "11. Contact",
    paras: ["Questions about these terms: {{email}}."],
  },
];

export function privacySections(v: LegalVars): LegalSection[] {
  return apply(PRIVACY, v);
}

export function termsSections(v: LegalVars): LegalSection[] {
  return apply(TERMS, v);
}

/**
 * ⚠️ 改成 true 表示「已过专业顾问审核」。
 *    在那之前，开发环境下页面顶部会显示一条草稿提示（生产环境不显示）。
 */
export const LEGAL_REVIEWED = false;
