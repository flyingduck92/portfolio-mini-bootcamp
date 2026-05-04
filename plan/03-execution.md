# Step-by-Step Execution Plan

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