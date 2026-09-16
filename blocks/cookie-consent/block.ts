import { defineBlock, fields } from "@cmssy/react";
import CookieConsent from "./CookieConsent";

export const cookieConsentProps = {
  "title": fields.text({ label: "Title" }),
  "body": fields.textarea({ label: "Body", required: true }),
  "acceptLabel": fields.text({ label: "Accept Label", required: true }),
  "rejectLabel": fields.text({ label: "Reject Label", required: true }),
  "policyLabel": fields.text({ label: "Policy Link Text" }),
  "policyUrl": fields.link({ label: "Policy URL" })
};

export const cookieConsentBlock = defineBlock({
  type: "cookie-consent",
  category: "Layout",
  label: "Cookie Consent",
  description: "Analytics consent banner (layout block); reopens from any link ending in #cookie-settings.",
  layoutRegions: ["footer"],
  component: CookieConsent,
  props: cookieConsentProps,
});
