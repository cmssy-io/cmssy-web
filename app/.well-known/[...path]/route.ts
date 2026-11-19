// Nothing is served under /.well-known yet. Without this route every probe
// (ARD's /.well-known/ard.json, ai-catalog.json, ...) fell through to the
// catch-all and rendered the CMS 404 page; on a cold region that took longer
// than the 2 s Lighthouse allows, so PageSpeed reported the ARD manifest as
// "could not be loaded" instead of absent. A plain, CDN-cached 404 answers in
// milliseconds and reads as "not applicable". Add a real file as a sibling
// route when one is published.
export function GET() {
  return new Response("Not found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=86400",
    },
  });
}
