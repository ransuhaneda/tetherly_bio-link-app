# Tetherly Bio Link — Frontend Design Brief

## Product direction

Tetherly is the calmer, more authored alternative to Linktree: one memorable URL that turns a creator's scattered channels into a clear, intentional destination. The design should feel like an editorial profile rather than a link directory—quiet confidence, strong hierarchy, and fast access to the next action.

This brief uses the 2026-08-23 UI inspiration capture as **directional research only**. It borrows the references' whitespace, image framing, compact utility labels, and staged reveals; it does not copy their compositions, copy, imagery, or visual signatures.

## Source-of-truth constraints

- Preserve the existing landing copy, including **“All your links, neatly tethered.”**, its supporting paragraph, and the **Create Your Tether** username form.
- Preserve the current brand palette in `src/assets/styles/base/_colors.scss`: near-black `#040404`/`#161614`, warm white `#fcfff6`, orange `#ff5e32`, violet `#7154eb`, lime `#b6cf4f`, and the existing semantic scales. Do not introduce a replacement palette.
- Preserve approved local assets: `src/assets/images/ahmet-yuksek-zSiqe6j9Aao-unsplash.jpg` and `src/assets/images/toa-heftiba-IrpBb-5YGZw-unsplash.jpg`. Treat the inspiration-capture JPGs as research evidence, not production assets.
- Preserve named interactions/routes: the username form, navbar authentication links (`Log In`, `Create an Account`), and existing route destinations. Unimplemented nav destinations remain visibly pending rather than becoming invented content.
- Use existing local typefaces: **Nunito** for body/UI and **Oswald** for display/utility emphasis. Do not add a remote font dependency.

## Primary design system: Editorial Bento Profile

The primary system is **UI/UX Pro Max — Bento Grids**, adapted to Tetherly's existing dark, warm, high-contrast palette. The reference capture's editorial layouts inform pacing, not a template.

### Layout system

- Use a centered `lg-wrapper` with a `max-width` of 1312px and a 24px minimum gutter; cap readable text measure at 32–38rem.
- Desktop landing: a 12-column grid. The hero copy occupies columns 1–7; the profile/link preview occupies columns 8–12. Keep the CTA aligned to the copy baseline, not floating independently.
- Below the hero, use an asymmetric 3/2/1 card rhythm for link groups, creator proof, and the approved image assets. Cards share one radius and border language; vary span and crop, not decoration.
- Keep the navbar sparse: brand left, primary links center/right, auth actions at the far edge. On mobile it becomes a two-row shell: brand + menu control, then a full-width action tray.
- Maintain a clear reading order in DOM order: identity → value proposition → create form → link preview/proof → secondary content → footer.

### Type scale

Use the existing Sass tokens as the baseline and map them consistently:

| Role                 | Family | Size / line-height                            | Weight  |
| -------------------- | ------ | --------------------------------------------- | ------- |
| Display hero         | Oswald | `clamp(3rem, 7vw, 5rem)` / 0.98               | 600–700 |
| Section heading      | Oswald | `clamp(2rem, 4vw, 3rem)` / 1.05               | 600     |
| Card/link title      | Nunito | `1.125rem` / 1.3                              | 600     |
| Body/supporting copy | Nunito | `1rem` / 1.5                                  | 400     |
| Utility/eyebrow      | Oswald | `0.75rem` / 1.2, uppercase, `0.12em` tracking | 400–600 |
| Button/input text    | Nunito | `0.875rem` / 1.2                              | 600     |

Never use text below 12px. Keep the hero line break intentional at wide sizes, but allow normal wrapping below 768px.

### Spacing and surfaces

Use an 8px base rhythm: `8, 16, 24, 32, 48, 64, 96, 128px`. Section padding is 96–128px desktop, 64px tablet, and 48px mobile. Cards use 24px desktop / 16px mobile internal padding. Use the existing border and neutral tokens; depth comes from contrast and one restrained shadow, not gradients or glass effects.

The orange scale is the primary action signal. Violet and lime are reserved for link-category accents, status, or small highlights. Ensure all text/background pairs reach 4.5:1; preserve visible `:focus-visible` rings.

## Responsive behavior

- **320–767px:** single column; hero, form, and preview stack; form controls become full width; link cards are one column; auth actions become 44px-tall full-width targets; use safe-area bottom padding.
- **768–1023px:** two-column hero with a 16px–24px gutter; cards can use a 2-column grid; keep navbar links available without horizontal overflow.
- **1024px+:** 12-column composition and asymmetric card spans; hero has a minimum 72vh height but never traps content; preserve a 24px outer gutter at 1440px and above.
- Test at 375, 768, 1024, and 1440px. No horizontal scrolling, clipped focus ring, or layout shift from images.

## Motion choreography

Supporting motion skill: **Animation Systems (Stripe × Linear × Apple × Vercel)**. Motion communicates hierarchy and feedback; it is not decoration.

### Tokens

- Micro hover/press: 160ms, ease-out.
- Focus/selection: 220ms, ease-out.
- Card/section reveal: 480–650ms, ease-out, 40–70ms stagger.
- Hero sequence: 900–1200ms total, with 80ms internal beats.
- Animate `transform` and `opacity`; avoid layout properties and large-area blur.

### Sequence

1. On first load, reveal the brand shell and background surface.
2. Fade/rise the hero headline first, then the supporting copy.
3. Reveal the username field and **Create Your Tether** button last, preserving the form's immediate usability.
4. As the link preview/cards enter the viewport, use a one-time fade + 12px rise stagger from DOM order. Do not replay on tiny scroll reversals.
5. Link-card hover uses a 2–4px lift and border/accent change; focus uses the same spatial cue without relying on hover.
6. Submit feedback is explicit: disabled/loading state, then inline success or error near the field. Preserve entered text on error.
7. With `prefers-reduced-motion: reduce`, remove rise, stagger, parallax, and scroll-scrub; content remains visible and state changes are immediate.

Do not add a WebGL hero, magnetic CTA, autoplay video, or copied reference transition without a separate performance and content decision.

## Asset provenance

- **Production-approved:** the two existing Unsplash-derived files in `src/assets/images/`; retain their current local filenames and attribution metadata if surfaced in the UI. Use `ResponsiveImage` with reserved aspect-ratio boxes and lazy loading below the fold.
- **Research-only:** `/home/ransu/personal-projects/ui-upskill/articles/2026-08-23-ui-inspiration-capture/` and its `sections/`/`motion-frames/` are visual studies from Rocket, Pexovia, Luzco, Mereawi Musie, and Blink. They establish principles (editorial whitespace, cinematic crop, staged reveal) and must not be copied into the product or shipped as assets.
- **Icons:** use the existing `react-icons` dependency or inline accessible SVG; never use emoji as interface icons.

## Verification checkpoints

- **Content:** exact existing headline, paragraph, CTA label, field prefix, and auth labels are present; no invented claims or links.
- **Palette/type:** all rendered colors map to existing Sass tokens; Nunito/Oswald load locally; contrast passes for body, CTA, borders, and focus states.
- **Interaction:** keyboard can reach every link, input, button, and menu control; Enter submits the form; validation/loading/error/success feedback is local and readable; touch targets are at least 44×44px.
- **Responsive:** inspect 375/768/1024/1440px screenshots for centering, wrapping, crop, overflow, and preserved hierarchy.
- **Motion:** verify first-load order, one-time scroll reveals, hover/focus parity, and reduced-motion output. Confirm no animation causes layout shift.
- **Assets/performance:** images reserve space, lazy-load below fold, and no inspiration-capture files are imported by the app.
- **Route safety:** `/`, `/login`, `/signup`, and existing named route destinations still resolve; no placeholder route is promoted as finished content.
