/// <reference types="vite/client" />
// Vite's client types: declares `*.css` and asset imports (`import "./style/app.css"`)
// and `import.meta.env`. TypeScript 6 type-checks side-effect imports
// (`noUncheckedSideEffectImports` is on by default), so without this the CSS
// entry import in main.tsx is an error.
