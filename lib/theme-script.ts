/**
 * The inline script the document runs before its first paint.
 *
 * It is a plain module, not part of the client theme component: a server
 * component has to call it to render the tag, and a function exported from a
 * "use client" module cannot be called on the server.
 *
 * Two jobs, both of which have to happen before anything is painted:
 * the theme (the user's choice, else the system preference) and `<html lang>`
 * (the root layout sits above the path, so it can only render the workspace
 * default - a reader of a Polish page would otherwise start in English).
 */
export const THEME_STORAGE_KEY = "cmssy-theme";

export function themeInitScript(enabledLocales: string[] = []): string {
  const locales = JSON.stringify(enabledLocales);
  return `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}try{var l=${locales};var seg=location.pathname.split('/')[1];if(l.indexOf(seg)>-1){document.documentElement.lang=seg;}}catch(e){}})();`;
}
