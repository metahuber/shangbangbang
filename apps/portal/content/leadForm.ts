/**
 * 留资表单的文案
 *
 * 表单在首页、价格页、产品页、联系页都会出现，文案统一放在这里。
 *
 * 💡 下拉框「我想做」的选项**不在这里**——它自动取自 content/products.ts。
 *    你加了新产品，表单里就会自动多一个选项。
 */

export const leadForm = {
  name: {
    label: "怎么称呼你",
    placeholder: "比如：王老板",
  },
  contact: {
    label: "手机号或微信号",
    placeholder: "方便我们联系你",
    hint: "我们不会给你打骚扰电话，也不会把你的信息给别人。",
  },
  interest: {
    label: "我想做",
    /** 下拉框最后一个选项 */
    fallbackOption: "还不确定，想先聊聊",
  },
  note: {
    label: "补充说明",
    optional: "（选填）",
    placeholder: "你的行业、现在遇到的情况，随便说两句",
  },
  submit: "免费获取方案",
  submitting: "提交中…",
  success: {
    title: "收到了！我们会在 24 小时内联系你。",
    desc: "急的话直接扫右侧的二维码加微信，或者打上面的电话。",
  },
  errorSuffix: "。麻烦直接扫码加微信，或者打上面的电话。",
};
