# Mirabelle App - Changes Made (6 April 2026)

## Overview
Updates to the Harriet Muncaster Book Tracker PWA, a web app for tracking children's book collections (Isadora Moon, Mirabelle, and Emerald series).

---

## 1. iPad Home Screen Icon

**What:** Added `<link rel="apple-touch-icon" href="home-icon.png">` to the HTML head, and uploaded the custom anime-style character image as `home-icon.png`.

**Why:** The app previously had no custom icon, so iPad showed a screenshot thumbnail when added to the home screen.

**How to apply:** Delete the old home screen shortcut, re-open the app in Safari, and tap Share > Add to Home Screen.

---

## 2. Series-Specific Wand Animations

**What:** When a user taps "Got it!" to mark a book as owned, the magic wand animation now varies by series:

| Series | Animation |
|--------|-----------|
| **Mirabelle** | Rainbow particle arc (unchanged from original) |
| **Isadora Moon** | Bats fly out of the wand |
| **Emerald** | Water fountain effect with blue droplets |

**Technical details:**
- `playWandAnimation()` now accepts a `seriesId` parameter and dispatches to `playBatAnimation()`, `playWaterAnimation()`, or `playRainbowAnimation()`
- `toggleOwned()` looks up the book's series from the `BOOKS` array and passes it directly, so animations work correctly on both the character page AND the All Books page
- New CSS keyframe animations added: `@keyframes batFly` and `@keyframes waterFountain`

---

## 3. Cascading Cover Image Fallback

**What:** Book cover images now try multiple sources automatically instead of falling straight to an emoji when one source fails.

**Previous behaviour:** Each book tried a single image URL. If it failed, the emoji was shown immediately. Many Google Books URLs return placeholder images, causing ~29 books to show emojis.

**New fallback chain (in order):**
1. Open Library by cover ID (`covers.openlibrary.org/b/id/{coverId}-M.jpg`)
2. Google Books URL (from `googleCover` field)
3. Open Library by ISBN (`covers.openlibrary.org/b/isbn/{isbn}-M.jpg`) - **NEW**
4. Amazon CDN by ISBN-10 (`m.media-amazon.com/images/P/{isbn10}...`) - **NEW**
5. Emoji (last resort)

**Technical details:**
- New `tryNextCover(img)` function handles cascading: reads remaining URLs from `data-fallbacks` attribute, tries the next one, or shows emoji when all are exhausted
- Each `<img>` tag stores the full fallback chain as a JSON array in `data-fallbacks`

---

## 4. Emerald Series Cover Image Fix

**What:** The Emerald series card on the home page was showing an emoji instead of a cover image.

**Cause:** The series-level `coverImg` referenced an invalid Open Library cover ID (`14346816`).

**Fix:** Replaced with the working Google Books URL for "Emerald and the Ocean Parade" (the first book in the series).

---

## 5. Cover Fallback Order Fix

**What:** Reordered the cover URL priority so `googleCover` is checked before the Amazon ISBN fallback.

**Previous order:** coverId > Amazon ISBN > Google Books
**New order:** coverId > Google Books > Open Library ISBN > Amazon ISBN

This ensures books with known Google Books URLs try those before generating a speculative Amazon URL.

---

## Files Changed
- `index.html` - All code changes (single-file PWA)
- `home-icon.png` - New file (iPad home screen icon)

## Commits (on branch `main`)
1. `424ad01` - Add apple-touch-icon for iPad home screen
2. `81d8f17` - Add series-specific wand animations
3. `16576a5` - Fix broken cover images, home page character images, and wand animations
4. `30dcfaf` - Rename home-icon.png.png to home-icon.png
5. `c21ee63` - Add cascading cover image fallback for reliable book covers
