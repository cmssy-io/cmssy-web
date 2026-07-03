# Spec: przebudowa homepage cmssy.com + nowe/usuwane bloki

Status: draft · Cel: strona ma pokazywać realny produkt (który jest bogatszy niż obecny landing) i przekonywać do zakupu. Diagnoza z review: produkt OK, strona pokazuje ~30% możliwości.

---

## 0. Model pracy: content vs kod

Landing to headless site na samym cmssy. Dwie warstwy zmian:

- **Content (przez MCP, bez deployu):** tekst hero/features/faq/cta, kolejność bloków, media. Edytowalne na żywo narzędziami `mcp__cmssy__*`. Efekt natychmiastowy.
- **Kod (PR do `cmssy-web`, wymaga deployu):** nowe typy bloków (komponent React + `defineBlock`), usunięcie bloków, zmiana schematu pól.

Rejestracja bloku: `blocks/<name>/block.ts` (`defineBlock`) + wpis w `cmssy/blocks.ts` (import + tablica `blocks`). Komponent w `blocks/<name>/src`.

**Śledzenie użycia bloków:** brak dedykowanego licznika. Bloki siedzą w `page.blocks[]`. Żeby wiedzieć czy/ile/gdzie - trzeba przeskanować strony (patrz Faza 0). „Zdefiniowany w repo" ≠ „używany".

---

## Faza 0 — audyt użycia bloków (przed usuwaniem)

Skrypt: `list_pages` → dla każdej `get_page` → policz `type` w `blocks[]` i `layoutBlocks[]`. Wynik: mapa `type → [strony]`.

- [ ] Zbuduj tabelę usage (49 stron, opublikowane + nieopublikowane).
- [ ] Oznacz bloki z 0 użyć = kandydaci do usunięcia.
- [ ] **Nie usuwaj** typu użytego na JAKIEJKOLWIEK stronie (też unpublished) - render fallback/błąd.

Wstępni kandydaci do usunięcia (do potwierdzenia audytem) — bloki member-auth na stronach nieopublikowanych: `login-form`, `register-form`, `forgot-password-form`, `customer-profile`, `newsletter-form`. UWAGA: repo ma `member-graphql` API, więc mogą być celowo pod members-area. Decyzja produktowa, nie techniczna.

---

## Faza 1 — przebudowa treści homepage (MCP, bez deployu)

Obecna homepage: `hero → features → faq → cta`. Cała środkowa część brakuje. Nowa struktura (P1 = must, P2 = should):

| #   | Blok              | Typ                               | Priorytet | Uwagi                                                                           |
| --- | ----------------- | --------------------------------- | --------- | ------------------------------------------------------------------------------- |
| 1   | hero              | istniejący                        | P1        | przepisać copy; wrzucić realny screenshot/wideo (pole `media` przyjmuje video!) |
| 2   | how-it-works      | reuse `features` lub nowy `steps` | P1        | 3 kroki: Model content → Edit visually/AI → Render in your Next.js              |
| 3   | demo-video        | **nowy**                          | P1        | „Watch AI build a Black Friday page" - killer demo                              |
| 4   | product-showcase  | **nowy**                          | P1        | galeria screenów: edytor, AI chat, content tree, media library                  |
| 5   | features          | istniejący                        | P1        | dodać: revisions, commerce, audit log, brand-AI                                 |
| 6   | use-cases         | **nowy**                          | P2        | grid: Marketing, Landing, Ecommerce, Docs, Blog, Multi-brand                    |
| 7   | code-snippet      | **nowy** (lub pola hero)          | P2        | `await cmssy.pages.get(...)` + `<CmssyPage slug="home" />`                      |
| 8   | comparison-table  | **nowy**                          | P2        | Cmssy vs Sanity/Storyblok/Contentful (uczciwie)                                 |
| 9   | pricing (preview) | reuse `pricing`                   | P2        | kompaktowy wariant + link do /pricing                                           |
| 10  | faq               | istniejący                        | P1        | zostaje                                                                         |
| 11  | cta               | istniejący                        | P1        | zostaje                                                                         |

### Copy do przepisania (hero)

- Headline: jedno mocne zdanie, np. „Stop redeploying your site to change a heading." albo „The headless CMS your marketing team can actually use."
- Wyczyść `socialProofCount` = "2,000+" default (nieprawdziwy social proof) → albo realna liczba, albo usuń.
- Podłóż realny screenshot produktu (nie placeholder).

---

## Faza 2 — nowe bloki (PR do repo)

Każdy: `blocks/<name>/block.ts` (`defineBlock` + `fields.*`) + `blocks/<name>/src/index.tsx` + rejestracja w `cmssy/blocks.ts`. Konwencja pól jak w `hero/block.ts`.

- [ ] **`demo-video`** (P1) — pola: `heading`, `subheading`, `poster` (media), `videoUrl` (media/link), `autoplay` bool. Autoplay loop muted + click-to-play z dźwiękiem.
- [ ] **`product-showcase`** (P1) — pola: `heading`, `items[]` = { `image` (media), `title`, `caption` }. Tab/gallery layout.
- [ ] **`comparison-table`** (P2) — pola: `heading`, `competitors[]` (nagłówki kolumn), `rows[]` = { `feature`, `values[]` (✅/⚠️/❌/tekst) }. Cmssy zawsze pierwsza kolumna.
- [ ] **`use-cases`** (P2) — pola: `heading`, `cases[]` = { `icon`, `title`, `description`, `url` }.
- [ ] **`code-snippet`** (P2) — pola: `heading`, `tabs[]` = { `label`, `language`, `code` }. Read-only, kolorowanie składni. (Alternatywa: reuse `docs-code-block`.)
- [ ] Cleanup: usunąć śmieciowe pole `"test"` z `hero/block.ts`.

---

## Faza 3 — usunięcie nieużywanych bloków (po Fazie 0)

- [ ] Dla każdego bloku z 0 użyć: usuń folder `blocks/<name>/`, usuń import + wpis w `cmssy/blocks.ts`.
- [ ] Zbuduj (`pnpm build`) - weryfikacja braku dangling importów.
- [ ] Decyzja produktowa nt. member-auth blocks (patrz Faza 0).

---

## Uczciwe komunikaty — co wolno, czego NIE

**Mamy (bezpiecznie eksponować):** visual editor / page builder, AI/MCP editing, native commerce (products/orders/discounts/carts, order pipelines, inventory), own frontend (SDK), **revisions / version history**, **dual-buffer atomic publishing**, multilingual, media library, forms, webhooks, **granular permissions (25+) + roles**, **audit log**, API tokens (versioned), GraphQL + public API, **brand AI embeddings**, multi-tenant workspaces, CDN.

**NIE mamy — nie obiecywać:**

- ❌ **Image optimization / resize** (tylko rewrite URL). Nie do tabeli porównawczej. → roadmap.
- ❌ **Scheduled publish**. → roadmap.
- ⚠️ **Search** tylko substring (nie „powerful/full-text").
- ⚠️ **SEO**: są pola meta, brak auto-sitemap dla klienta. „SEO controls" ok, „SEO suite" nie.

---

## Assety (zdjęcia/wideo) — skąd

- **Screenshoty:** w Media Library są 3-4 realne (`Zrzut ekranu 2026-03-*`) - słabe/przypadkowe. Zrobić świeże, czyste zrzuty z admina: edytor, AI chat/Spotlight, content tree, media library, revisions. Upload przez Media Library.
- **Wideo demo:** nagrać ekran jak AI buduje stronę przez MCP+Spotlight („Create Black Friday landing"). QuickTime/Screen Studio. To #1 differentiator vs Storyblok/Sanity. Można nagrać od razu - MCP działa.
- Stock (unsplash) już w Media Library dla blog/tła.

---

## Kolejność wykonania (ROI)

1. Faza 1 content przez MCP (natychmiastowy efekt, 0 deploy) — hero rewrite + reorg + istniejące screeny.
2. Nagranie demo-wideo + blok `demo-video` (P1).
3. Blok `product-showcase` (P1) + świeże screeny.
4. `comparison-table` + `use-cases` + `code-snippet` (P2).
5. Faza 0 audyt → Faza 3 cleanup (równolegle, niskie ryzyko).

---

## Powiązane inicjatywy (poza homepage)

Podczas prac wypłynęły 2 pomysły produktowe (osobne tickety, repo `cmssy`, nie `cmssy-web`):

### A. Tracking użycia bloków (gdzie/ile razy)

Nie wymaga przebudowy modelu bloków - bloki zostają embedded w stronach; to additive read-only aggregation.

- **Backend:** `block-usage.service.ts` wzorem `media-usage.service.ts`. Mongo aggregation na `pages`: `$unwind blocks` → `$group by type` → count + lista stron. Zero zmian w modelu (opcjonalnie później denormalizowany licznik przy save dla O(1)).
- **GraphQL + MCP:** query `blockTypeUsages` + tool `get_block_usage` → `[{type, count, pages:[{id,slug,name}]}]`.
- **Editor UI:** badge „użyty N×" przy typie w palecie + lista stron „gdzie".
- Rozróżnienie: użycie TYPU = aggregation; lokalizacja INSTANCJI = jej jedyna strona (blok ma unikalny UUID per strona); header/footer = layout, dziedziczone.
- Effort: backend+MCP mały (reuse wzorca), UI średni.

### B. Samoopisujące bloki dla AI (AI-native page composition)

Cel: Spotlight na „zrób stronę domową" rozumie bloki i komponuje poprawną stronę (hero → logo marquee → features → ... → cta).

**Kluczowe ustalenie: rurociąg już istnieje, brakuje tylko treści metadanych.**

- Dziś: headless app wysyła `blockMeta` ({label, category, icon, layoutPositions}) przez `cmssy:ready`. Backend `GeneratePageInput.blockSchemas` **już ma opcjonalne `description`** (`ai-page-generation.service.ts:25-35`) - tylko nie jest wypełniane. LLM dostaje jedynie type+name+fields.
- Brak systemu recipe/template - LLM freeformuje strukturę z nazw typów. Stąd suboptymalna kolejność.

**Co dodać (additive, 3 repo, każdy krok mały):**

1. **SDK (`cmssy-sdk`/@cmssy/react):** rozszerzyć `defineBlock` + `CmssyBlockMeta` + `blocksToMeta` o `description` (`category` już jest). Publikacja wersji.
2. **cmssy frontend bridge:** rozszerzyć `CmssyBlockMeta` (`cmssy-bridge-protocol.ts:35-40`) + `AiBlockSchema` + `buildAiBlockSchemas` (`build-block-schemas.ts:13-36`) o pass-through `description`/`category` (~5 linii).
3. **cmssy backend prompt:** wstrzyknąć semantic guidance + opcjonalne page-recipe do system promptu (`ai.service.ts:293-318`).
4. **cmssy-web:** bump SDK + dopisać `description` do 35 bloków (content na definicjach).

**Rekomendacja co do „kod/zdjęcia":** priorytet = **tekstowy `description` per blok** - to konsumuje LLM (selekcja + kolejność) i daje największy skok jakości, zgodnie z konwencją tool-calling (opis wchłania „kiedy użyć"). `whenToUse`/`example` odrzucone: osobne pola nakładają się na opis (pogarsza selekcję) i nikt tak nie robi (Storyblok/Anthropic/OpenAI). Ewentualny few-shot = przyszłościowo z retrievalu realnych opublikowanych bloków, nie ręcznie zaszyty per blok. Screenshoty/preview = przydatne dla ludzkiej palety, niepotrzebne do kompozycji AI → faza 2/opcjonalnie. Page-recipes = średni ROI, start heurystyką po `category`.

**Zależność:** to przekształca inicjatywę „nowe bloki" - każdy NOWY blok powinien od razu nieść metadane AI, a 35 istniejących retrofitujemy. Fundament metadanych (krok 1 SDK) najlepiej zrobić PRZED masową budową bloków.

**Effort:** bridge+prompt = mały (rurociąg gotowy), SDK = mały-średni, authoring 35 opisów = content. Preview images = osobna, większa faza.

---

## Decyzje (2026-07-01)

- **Member-auth bloki → USUNĄĆ** (Faza 3). Marketing site nie potrzebuje auth (logowanie na cmssy.io). Warunek: audyt potwierdza 0 użyć na jakiejkolwiek stronie.
- **Ecommerce → jeden z use-case'ów** w bloku `use-cases`, nie osobna narracja. Fokus zostaje na „headless CMS + AI".
- **Start → Faza 1 przez MCP** (przebudowa treści homepage, edycje do draftu, publikacja po akceptacji).

## Pytania otwarte

- Mamy realny social proof (logo klientów, liczby) czy pomijamy sekcję zaufania na teraz?
- Kto nagrywa demo-wideo i robi świeże screeny (Ty vs ja mogę wygenerować scenariusz + shot-list)?
