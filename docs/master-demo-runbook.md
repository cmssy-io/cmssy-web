# Master demo - runbook (CMS-1850)

The shot: one prompt in Claude, the agent runs a commerce loop no content CMS can run, the storefront reflects it. Recorded in the **cmssy test** workspace only. Environment built 2026-10-08 (CMS-1849) - MACHTEC industrial storefront, 12 products, orders #12-#18, fictional customers only.

## Pre-flight (5 min)

1. Storefront: `cd ~/Projekty/examples/next-storefront && pnpm dev` (already linked to `cmssy/cmssy-test` via `.env.local`). Open http://localhost:3000 - MACHTEC homepage with the TRADE8 promo strip.
2. Tunnel + webhook (optional beat - delivery proof): `cloudflared tunnel --url http://localhost:3000`, then `create_webhook` on cmssy-test pointing at `<tunnel>/api/revalidate` for order events. Skip if the beat is just `list_webhook_deliveries` output.
3. Fresh refund target if #15 is spent: `create_manual_order` (fictional `*.example` email, 2-3 lines from the 12 SKUs) + `mark_order_paid` (amount from `get_order`, provider `bank_transfer`).
4. Clean browser profile, 16:9 window, Screen Studio 60 fps, smooth cursor (see demo-video-shotlist.md §0-1).

## The take (~40-60 s)

Layout: Claude terminal left, storefront right.

| # | Beat | What happens |
|---|---|---|
| 1 | Type the prompt: *"Order 15 arrived damaged - refund it, give that customer a 15% apology code and let the site know."* | One sentence, plain language |
| 2 | Agent: `refund_order` #15 | Money operation first - the half Storyblok does not have |
| 3 | Agent: `create_discount` SORRY15, 15% | |
| 4 | Agent: `update_block_content` on the homepage promo-strip (content keyed `{en: {...}}`) + `publish_page` | The site learns the code |
| 5 | (optional) `list_webhook_deliveries` | The event fired, integrations heard it |
| 6 | Refresh the storefront | Promo strip now reads SORRY15. Nobody opened the admin |

## Reset between takes

- Promo strip back: `update_block_content` mode `replace`, `{en: {text: "TRADE8 - 8% off orders over 500 EUR net, applied at checkout.", linkText: "See the terms", linkUrl: "/cart"}}` + `publish_page`.
- `set_discount_enabled` SORRY15 (or the new code) → false. Discounts cannot be deleted - disable and reuse a fresh code name per take (SORRY15B...).
- Refunded orders stay refunded - create a fresh paid order per take (step 3 above). History looks believable either way.

## Deliverables (ticket)

16:9 master, any speed-up labelled; separate 9:16 captures for reels (crop the storefront, not the terminal); poster frame = storefront with the code visible.
