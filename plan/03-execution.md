# Step-by-Step Execution Plan - Sekti Wicaksono Portfolio

### Phase 1: Foundation (HTML/Tailwind)
1. Setup basic HTML5 boilerplate.
2. Add modern CSS Reset: *,*::before, *::after {box-sizing:border-box,margin:0,padding:0}
3. Configure Tailwind `theme.extend` for "Cute-alist" colors and border-radius (`3xl`).
4. Build the responsive grid system.

### Phase 2: Component Synthesis
1. **Navigation:** Implement the Kevin Powell-inspired fluid nav.
2. **Buttons:** Apply the JH3Y "Magnetic/Shimmer" effects to the CTA and Secondary buttons.
3. **Vault (Projects):** Build the card grid with the spotlight hover script.

### Phase 3: Animation (GSAP)
1. Initialize `ScrollTrigger` for section fades.
2. Create the "Hero" entrance timeline (text scramble + bounce).
3. Connect the Crossfade carousel logic to the project "Vault."

### Phase 4: Dark Mode & Refinement
1. Implement `localStorage` theme switcher.
2. Ensure all soft shadows transition to glowing accents in dark mode.


---

### RTCC-O Check
- R: ✅
- T: ✅
- C: ✅
- C: ✅
- O: ✅

## Review
- [✅] Sesuai constraints?
- [✅] Format sesuai?
- [✅] Bisa dipahami?
- Changes: Perubahan model dari Claude Sonnet ke Gemini 2.0 Flash, tidak memakan token terlalu banyak. Namun, perlu lebih banyak revisi pada detailing, serta perlu intruksi tambahan agar memastikan perubahan yang baru tidak membuat style dan functionalitas sebelumnya error/broken.

#### Contoh prompt:
read & understand 03-execution.md, then implement it without breaking the current style and functionality. The implementation should be enhanced the style and functionality not broke them

---

## Common Mistakes

| Mistake | How to Avoid |
|---------|--------------|
| Prompt terlalu panjang | Pecah jadi step kecil |
| Skip review | Baca setiap baris output |
| Copy-paste tanpa paham | Tanya ke AI jika bingung |
| Lanjut tanpa fix | Fix sebelum next step |