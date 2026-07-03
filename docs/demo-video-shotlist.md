# Demo video + screenshots - production guide & shot-list

Status: ready to record · Cel: nakarmić bloki `demo-video` (hero, P1) i `product-showcase` (P1) realnym materiałem. Bloki są już na produkcji (w palecie edytora).

---

## 0. Narzędzia (Mac)

| Narzędzie                        | Do czego                   | Uwaga                                                                                                                                             |
| -------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Screen Studio** (rekomendacja) | główne nagrania produktu   | auto zoom-to-cursor, smooth cursor, auto-zoom na klik, export 16:9. Jednorazowe ~$149, tylko Mac. Idealne do „polished product demo" bez montażu. |
| Tella                            | alternatywa w przeglądarce | clip-by-clip, działa też na Windows, podobny efekt                                                                                                |
| QuickTime                        | szybki surowy zrzut        | zero polish, tylko awaryjnie                                                                                                                      |
| OBS                              | pełna kontrola, darmowe    | stroma krzywa, przerost formy nad treścią tutaj                                                                                                   |
| **CleanShot X**                  | statyczne screeny + retina | do `product-showcase`, czyste zrzuty okien z tłem/cieniem                                                                                         |

Decyzja: **Screen Studio do wideo, CleanShot X do stillów.** Oba na Maca, zero montażu w edytorze wideo.

---

## 1. Setup przed każdym nagraniem (raz, potem trzymaj)

- **Rozdzielczość / format:** nagrywaj tak, żeby kadr był **16:9** - bloki renderują `aspect-video`. Nagrywaj okno przeglądarki, nie cały ekran (mniej śmieci).
- **Czysty workspace demo:** NIE nagrywaj produkcyjnego cmssy.com. Zrób osobny **demo-workspace** z wypełnioną, ładną treścią (realne teksty, dobre zdjęcia z Media Library). Puste stany wyglądają słabo.
- **Przeglądarka:** ukryj bookmarki, rozszerzenia, osobiste dane. Incognito + czysty profil. Zoom strony 100-110%.
- **Kursor:** w Screen Studio włącz smooth cursor + auto-zoom na klik. Klikaj wolno i celowo - nie szarp.
- **Dane:** żadnych prawdziwych maili/nazwisk klientów. Fikcyjne, ale wiarygodne.
- **Długość docelowa:** hero-loop **20-30 s**, cichy, zapętlony. (Blok `demo-video` w trybie `autoplay` = muted loop - musi czytać się bez dźwięku, więc wszystko tłumaczą napisy na ekranie i sam ruch UI.)

---

## 2. Wideo A - HERO: „Watch AI build a Black Friday page" (P1, killer)

To jest #1 differentiator vs Storyblok/Sanity. Pokazuje unikat: **AI edytuje TREŚĆ przez MCP/Spotlight, nie generuje kodu.**

**Tryb w bloku:** `autoplay` = ON (muted, loop, 20-30 s). Napisy na ekranie prowadzą narrację. Poster = ostatnia klatka z gotową stroną.

### Shot-list (beaty, ~25 s):

| #   | Czas    | Co na ekranie                                                                                                      | Napis / label overlay             |
| --- | ------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| 1   | 0-3 s   | Pusty/prosty edytor strony w cmssy, kursor otwiera Spotlight (⌘K / chat AI)                                        | „Ask AI to build a page"          |
| 2   | 3-7 s   | Wpisany prompt: _„Create a Black Friday landing page"_, Enter                                                      | pokaż wpisywanie na żywo          |
| 3   | 7-16 s  | Bloki **pojawiają się kolejno** w podglądzie: hero → features → pricing → cta. Auto-scroll w dół w miarę dodawania | „Hero → features → CTA, in order" |
| 4   | 16-21 s | Klik w heading w wizualnym edytorze, edycja tekstu inline na żywo                                                  | „Edit anything visually"          |
| 5   | 21-25 s | Klik **Publish** → toast „Published". Cięcie do gotowej strony. Pętla wraca do pustego edytora                     | „Live. No redeploy."              |

**Zasady:** żadnego kodu na ekranie (to cała teza). Ruch płynny. Ostatnia klatka = gotowa, ładna strona (dobre pierwsze wrażenie w posterze). Zapętlenie: kadr 1 i kadr końcowy podobny tonalnie, żeby loop nie „skakał".

### Wariant narrowany (opcjonalnie, później)

Ta sama akcja, 60-90 s, z lektorem/voiceoverem, `autoplay` = OFF (native controls). Do umieszczenia np. na /features albo w blogu. Nie blokuje hero.

---

## 3. Screeny - `product-showcase` (P1)

4-6 czystych zrzutów retina (CleanShot X, okno + subtelny cień, jednolite tło). Każdy = jeden realny ekran produktu. Kadr ~16:9.

| #        | Ekran                                                    | title                | caption                                                                     |
| -------- | -------------------------------------------------------- | -------------------- | --------------------------------------------------------------------------- |
| 1        | Wizualny edytor strony z zaznaczonym blokiem + panel pól | „Visual editor"      | „Edit content in place, see exactly what ships."                            |
| 2        | Spotlight / AI chat w trakcie edycji treści              | „AI via MCP"         | „Ask Claude to write, translate, restructure - it edits content, not code." |
| 3        | Content tree / lista stron + bloki                       | „Structured content" | „Typed blocks and models, multilingual by default."                         |
| 4        | Media Library (siatka assetów)                           | „Media library"      | „Upload once, reuse everywhere."                                            |
| 5        | Historia wersji / revisions strony                       | „Version history"    | „Every publish is versioned - roll back anytime."                           |
| 6 (opc.) | Roles & permissions albo commerce (orders)               | „Roles & commerce"   | „25+ permissions, native products & orders."                                |

**Zasady stillów:** ten sam demo-workspace co wideo (spójność). Realna, wypełniona treść. Bez pustych stanów, bez dev-toolsów, bez osobistych danych. Retina 2x. Jednolity kadr/tło na wszystkich (spójna galeria).

---

## 4. Kolejność i „done"

1. Zbuduj demo-workspace z ładną treścią (raz - obsłuży wideo i stille).
2. Nagraj **Wideo A** (Screen Studio), wyeksportuj mp4 16:9 + wybierz klatkę na poster.
3. Zrób 4-6 stillów (CleanShot X).
4. Upload wideo + posterów + screenów do **Media Library** w cmssy.com.
5. Ja wpinam bloki na homepage przez MCP: `demo-video` (po hero) + `product-showcase` (po features), wypełniam treścią, publikuję.

Po Twojej stronie: kroki 1-4 (nagranie + upload). Po mojej: krok 5 (wpięcie + copy + publikacja).

---

Sources: [Best Demo Recording Software 2026 (HowdyGo)](https://www.howdygo.com/blog/demo-recording-software), [Screen Studio Alternatives 2026 (Zapier)](https://zapier.com/blog/best-screen-recording-software/), [Product demo tools 2026 (Product Hunt)](https://www.producthunt.com/categories/product-demo)
