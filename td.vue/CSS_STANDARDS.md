# CSS Standards and Structure

## Bootstrap Compatibility

This project has transitioned from Bootstrap to PrimeVue components, but maintains Bootstrap's look and feel through custom styling.

### Visual Consistency

- All PrimeVue components are styled to match the previous Bootstrap theme
- Custom variables match Bootstrap's color palette and spacing
- Components maintain the same visual style as the Bootstrap equivalents

## Current Structure (Simplified)

The CSS/SCSS structure has been simplified from the previous structure. Here's the current setup:

### Core Files
- `scss-includes.scss`: Utility variables and mixins (no math functions)
- `primevue-variables.scss`: All variables (colors and dimensions)
- `fonts.scss`: Font imports and typography
- `icons.scss`: Icon styling and sizes
- `primevue-theme.scss`: PrimeVue component theming

### Archived Files
The following files have been moved to the archive folder:
- `archive/colors.scss`: Consolidated into primevue-variables.scss
- `archive/sizes.scss`: Consolidated into primevue-variables.scss
- `archive/scss-globals.scss`: Consolidated into scss-includes.scss
- `archive/scss-math.scss`: Consolidated into scss-includes.scss
- `archive/bootstrap.scss`: Old Bootstrap customization
- `archive/bootstrap-theme.css`: Bootstrap theme
- `archive/print.scss`: Print-specific styles

### Color Standards
- Colors are defined in `primevue-variables.scss`
- We standardize on the British spelling: `$grey` (not `$gray`)

### CSS Variables
CSS variables are defined in `primevue-variables.scss` and use the format `--primary-color` etc.

### Import Order
In component or global styling, imports should follow this order:
1. scss-includes.scss (for basic utilities)
2. fonts.scss
3. icons.scss
4. primevue-variables.scss
5. primevue-theme.scss

## Best Practices

1. Use CSS variables for dynamic values that may change at runtime
2. Use SCSS variables for build-time constants
3. Use native CSS calc() instead of SCSS math functions
4. Avoid deeply nested selectors
5. Avoid using !important
6. Use the scoped attribute in Vue components where possible
7. For global styles, use well-named classes
8. Prefer CSS Grid and Flexbox over older layout techniques
9. Use utility mixins from scss-includes.scss for common patterns

## PrimeVue Component Styling Guidelines

When implementing new PrimeVue components, follow these guidelines:

1. **Match Bootstrap Look and Feel**
   - Check the archived Bootstrap styles in `/src/styles/archive/bootstrap.scss`
   - Apply equivalent styling to PrimeVue components
   - Use the same color palette, spacing, and typography

2. **Class Naming**
   - PrimeVue uses `.p-{component}` class naming (e.g., `.p-button`)
   - Add equivalent Bootstrap-like classes (e.g., `.btn-primary`) where needed

3. **Custom Styling**
   - Add component-specific styles in `/src/styles/primevue-theme.scss`
   - Use CSS variables from `/src/styles/primevue-variables.scss`
   - Add comments explaining the Bootstrap equivalent

4. **Testing Visual Consistency**
   - When replacing a Bootstrap component with PrimeVue, verify the styling matches
   - Pay attention to borders, padding, font sizes, and colors
   - Ensure hover and active states behave consistently