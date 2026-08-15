/** Type shim for CSS Modules so TypeScript accepts `import './x.module.css'`. */
declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>
  export default classes
}
