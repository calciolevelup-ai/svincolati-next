# SVINCOLATI — STYLE GUIDE (EXACT MATCH)

**Obiettivo**: Fare che il nuovo sito sia IDENTICO esteticamente al vecchio, ma con struttura Next.js

---

## FONTS

| Uso | Font | Weight | Size | Letter-spacing | Transform |
|-----|------|--------|------|-----------------|-----------|
| Titoli grandi (H1) | Anton | 400 | clamp(44px, 7vw, 86px) | -.01em | uppercase |
| Titoli pagina (H2) | Anton | 400 | clamp(30px, 4.5vw, 46px) | -.01em | uppercase |
| Sottotitoli | Anton | 400 | 20px | .02em | uppercase |
| Testo normale | Archivo | 400-700 | 14px-15px | normal | - |
| Labels | Spline Sans Mono | 400-600 | 11px | .1em | uppercase |
| Badge/Code | Spline Sans Mono | 500-600 | 10-11px | .02-.08em | - |

---

## SPACING & DIMENSIONS

### Padding
```
Input/Select: 12px 14px
Button: 14px 24px
Field container: 16px
Panel header: 20px (no padding inside)
Panel/Card: 28px (panels), 22px (player cards)
Auth box: 30px
Role option: 14px
Sport option: 12px 10px
Icon button: grid place-items
```

### Margins
```
Field: margin-bottom 16px
Page head: margin-bottom 30px
Panel: margin-bottom 22px
Tabs: margin-bottom 24px
Tab button padding: 10px
```

### Gap/Spacing
```
.logo gap: 11px
.nav-links gap: 4px
.role-toggle gap: 10px
.sport-grid gap: 8px
.field-grid gap: 16px 18px (2-column forms)
.pcard gap: variable
.tab gap: 6px
```

### Border Radius
```
Button/Input: 10-11px (usually 11px for buttons, 10px for inputs)
Sport option: 10px
Role option: 11px
Panel/Card: var(--radius) = 14px
Auth box: 18px
Nav burger: 9px
Icon button: 9px
```

---

## COLORS

### Semantic
```
Primary: var(--acid) - #41c285 (dark theme), #1f9d63 (light theme)
Primary dim: var(--acid-dim) - #2fa86d (dark), #17834f (light)
Danger: var(--danger) - #ff5a3c (dark), #d8381c (light)
Info: var(--blue) - #4cc2ff (dark), #1c8fcf (light)
```

### Backgrounds
```
Page bg: var(--bg) - #0b0d0a (dark), #f3f6f0 (light)
Card bg: var(--card) - #1c2118 (dark), #ffffff (light)
BG secondary: var(--bg-2) - #10130f (dark), #ffffff (light)
Card secondary: var(--card-2) - #232b1e (dark), #eef1ea (light)
```

### Borders & Lines
```
Line: var(--line) - #2e3426 (dark), #dde2d6 (light)
Line soft: var(--line-soft) - #232b1e (dark), #e7ebe1 (light)
```

### Text
```
Primary text: var(--text) - #f3f5ea (dark), #161a12 (light)
Muted: var(--muted) - #8e9482 (dark), #5e6657 (light)
Muted secondary: var(--muted-2) - #5f6453 (dark), #969d8a (light)
```

---

## COMPONENTS

### Button (.btn)
```css
font-family: Archivo
font-weight: 800
font-size: 15px
border: none
padding: 14px 24px
border-radius: 11px
cursor: pointer
transition: .18s
display: inline-flex
align-items: center
justify-content: center
gap: 9px
```

**Variants**:
- `.btn-primary`: background var(--acid), color #0b0d0a, hover: transform translateY(-2px)
- `.btn-ghost`: transparent bg, border 1px solid var(--line), color var(--text), hover: border-color var(--acid), color var(--acid)
- `.btn-block`: width 100%

### Input/Select/Textarea
```css
width: 100%
background: var(--bg-2)
border: 1px solid var(--line)
color: var(--text)
font-family: Archivo
font-size: 14.5px
padding: 12px 14px
border-radius: 10px
transition: .16s

&:focus {
  outline: none
  border-color: var(--acid)
  background: var(--field-focus)
}

&::placeholder {
  color: var(--muted-2)
}

select {
  appearance: none
  background-image: [dropdown SVG]
  background-repeat: no-repeat
  background-position: right 14px center
  padding-right: 36px
}
```

### Panel (.panel)
```css
background: var(--card)
border: 1px solid var(--line)
border-radius: var(--radius) /* 14px */
padding: 28px
margin-bottom: 22px
animation: rise .5s cubic-bezier(.2,.7,.2,1) both
```

### Panel Header (.panel-h)
```css
font-family: Anton
font-size: 20px
text-transform: uppercase
letter-spacing: .02em
margin-bottom: 20px
display: flex
align-items: center
justify-content: space-between
gap: 12px
```

### Player Card (.pcard)
```css
background: var(--card)
border: 1px solid var(--line)
border-radius: var(--radius)
padding: 22px
transition: .2s
position: relative
overflow: hidden
animation: rise .5s cubic-bezier(.2,.7,.2,1) both

&:hover {
  transform: translateY(-4px)
  border-color: #39402c
}

&::after {
  content: ""
  position: absolute
  top: 0
  left: 0
  width: 3px
  height: 0
  background: var(--acid)
  transition: .25s
}

&:hover::after {
  height: 100%
}
```

### Form Field (.field)
```css
margin-bottom: 16px

& label {
  display: block
  font-family: Spline Sans Mono
  font-size: 11px
  letter-spacing: .1em
  text-transform: uppercase
  color: var(--muted)
  margin-bottom: 8px
}

& label .req {
  color: var(--acid)
}
```

### Role Option (.role-opt)
```css
border: 1px solid var(--line)
background: var(--bg-2)
border-radius: 11px
padding: 14px
cursor: pointer
transition: .16s
text-align: left

&:hover {
  border-color: var(--muted)
}

&.on {
  border-color: var(--acid)
  background: rgba(65, 194, 133, .06)
}

.t {
  font-weight: 800
  font-size: 14.5px
  display: flex
  align-items: center
  gap: 8px
}

.s {
  font-size: 12px
  color: var(--muted)
  margin-top: 4px
  font-family: Spline Sans Mono
  letter-spacing: .02em
}

.ck {
  color: var(--acid)
}
```

### Sport Option (.sport-opt)
```css
border: 2px solid var(--line)
background: var(--bg-2)
border-radius: 10px
cursor: pointer
transition: .24s
font-family: Archivo
font-weight: 700
display: flex
align-items: center
justify-content: space-between
position: relative
overflow: hidden
padding: 12px 10px
height: 80px

&::before {
  content: attr(data-icon)
  font-size: 48px
  position: absolute
  right: 8px
  top: 50%
  transform: translateY(-50%)
  opacity: .5
  z-index: 1
}

span {
  writing-mode: vertical-rl
  text-orientation: mixed
  transform: rotate(180deg)
  font-size: 12px
  letter-spacing: .5px
  z-index: 2
  color: var(--text)
  line-height: 1.1
  margin-right: 6px
}

&:hover {
  border-color: var(--muted)
  background: var(--card)
}

&.on {
  border-color: var(--acid)
  background: rgba(65, 194, 133, .12)
}

&.on span {
  color: var(--acid)
}
```

### Tabs (.tabs)
```css
display: flex
gap: 6px
background: var(--bg-2)
border: 1px solid var(--line)
padding: 5px
border-radius: 11px
margin-bottom: 24px

button {
  flex: 1
  background: none
  border: none
  color: var(--muted)
  font-family: Archivo
  font-weight: 700
  font-size: 14px
  padding: 10px
  border-radius: 8px
  cursor: pointer
  transition: .16s
}

button.on {
  background: var(--acid)
  color: #0b0d0a
}
```

---

## ANIMATIONS

```css
@keyframes rise {
  from {
    opacity: 0
    transform: translateY(20px)
  }
  to {
    opacity: 1
    transform: translateY(0)
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%)
    opacity: .6
  }
  to {
    transform: translateX(0)
    opacity: 1
  }
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
```

Default transitions: `.16s`, `.18s`, `.2s`, `.24s`, `.25s` (ease default)

---

## LAYOUT

### .wrap (main container)
```css
max-width: 1180px
margin: 0 auto
padding: 0 24px
position: relative
z-index: 3
```

### Page/Main
```css
main {
  padding: 44px 0 80px
  min-height: 60vh
}

@media(max-width: 560px) {
  padding: 30px 0 60px
  .wrap { padding: 0 16px }
}
```

### .page-head
```css
margin-bottom: 30px

h2 {
  font-family: Anton
  font-size: clamp(30px, 4.5vw, 46px)
  text-transform: uppercase
  line-height: 1
  letter-spacing: -.01em
}

.page-desc {
  color: var(--muted)
  max-width: 52ch
  font-size: 15px
  margin-top: 10px
}
```

### .sec-tag (section label)
```css
font-family: Spline Sans Mono
font-size: 12px
letter-spacing: .16em
text-transform: uppercase
color: var(--acid)
margin-bottom: 11px
```

### .grid (card grid)
```css
display: grid
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
gap: 18px
```

---

## NAVBAR

- Position: sticky top, z-index 50
- Height: 68px
- Backdrop: blur(14px)
- Background: var(--nav-bg)
- Border bottom: 1px solid var(--line-soft)

Nav links button:
- Font: Archivo 600
- Font-size: 13.5px
- Padding: 8px 13px
- Border-radius: 8px
- Color: var(--muted), hover: var(--text), active: var(--acid)
- Background: hover var(--card-2)

---

## FORM PATTERNS

Two-column form:
```css
.two {
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 14px
}

@media(max-width: 560px) {
  grid-template-columns: 1fr
}
```

Form grid (2+ columns):
```css
.form-grid {
  display: grid
  grid-template-columns: repeat(2, 1fr)
  gap: 16px 18px
}

.full {
  grid-column: 1 / -1
}
```

---

## RESPONSIVENESS

### Breakpoints
- Desktop: 1024px+
- Tablet: 560px - 1024px
- Mobile: < 560px

### Key changes on mobile:
- `.wrap` padding: 0 16px (da 0 24px)
- `main` padding: 30px 0 60px (da 44px 0 80px)
- Form grids switch to 1 column
- Sport grid switches to 3 columns (from 5)
- Nav links collapse to sidebar

---

## KEY THINGS TO REMEMBER

✅ Every `.panel` and `.pcard` must have `animation: rise`
✅ All buttons must follow `.btn` pattern with transitions
✅ All inputs must have `.16s` transition and focus state
✅ All form labels must be Spline Sans Mono, 11px, uppercase
✅ Page titles must use Anton with clamp() sizes
✅ Spacing is VERY precise (6px, 8px, 10px, 11px gaps)
✅ Border radius varies: 8px nav, 9px icons, 10px inputs/opts, 11px buttons/options, 14px panels, 18px auth box
✅ Animations must use cubic-bezier(.2,.7,.2,1) or cubic-bezier(.2,.8,.2,1)
✅ Hover states: buttons translateY(-2px), cards translateY(-4px)
✅ No liquid glass in OLD site - remove glassmorphism from NEW pages to match OLD
