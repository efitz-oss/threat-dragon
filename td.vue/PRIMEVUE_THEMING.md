# PrimeVue Theming in Threat Dragon

This document provides an overview of the PrimeVue theming system implemented in Threat Dragon.

## Theme Structure

Threat Dragon uses a customized version of the PrimeVue "Lara Light Blue" theme with adaptations to match the application's design language. The theme is implemented through several SCSS files:

### 1. `primevue-variables.scss`

This file defines the CSS variables used throughout the application. It includes:

- Primary colors (using the $orange color from the original Threat Dragon palette)
- Text colors
- Accent colors with different shades for each (blue, green, red, etc.)
- Semantic colors (success, warning, error, info)
- Background and surface colors
- Font sizes
- Border radius values

These variables are available globally through `:root` and can be used in any component.

### 2. `primevue-theme.scss`

This file provides custom styling for specific PrimeVue components:

- Button styles and hover states
- Dialog styling
- Menubar customization
- Form components styling
- DataTable theme adjustments
- Toast notifications

### 3. `primevue-bootstrap-compat.scss`

This compatibility layer provides a bridge between Bootstrap and PrimeVue, allowing existing Bootstrap classes to be used during the transition:

- Button class equivalents
- Alert styles
- Card component compatibility
- Form control styling
- Table styling
- Grid system compatibility
- Spacing utilities

## Using the Theme

### In Vue Components

Use the CSS variables in your component styles:

```scss
.my-component {
  color: var(--primary-color);
  background-color: var(--surface-100);
  border: 1px solid var(--surface-300);
}
```

### Transitioning from Bootstrap

If you're migrating a component from Bootstrap to PrimeVue, you can initially rely on the compatibility layer:

```html
<!-- Old Bootstrap markup still works -->
<div class="container">
  <div class="row">
    <div class="col-md-6">
      <div class="card">
        <div class="card-header">Card Title</div>
        <div class="card-body">Content</div>
      </div>
    </div>
  </div>
</div>
```

But it's recommended to gradually transition to PrimeVue's native components:

```html
<div class="p-component">
  <div class="p-grid">
    <div class="p-col-12 p-md-6">
      <Card>
        <template #header>Card Title</template>
        <template #content>Content</template>
      </Card>
    </div>
  </div>
</div>
```

## Color Palette

The application uses a consistent color palette derived from the original Threat Dragon design:

- Primary: Orange (`#f2711c`)
- Info: Blue (`#2185d0`)
- Success: Green (`#21ba45`)
- Warning: Amber (`#fbbd08`)
- Error: Red (`#db2828`)

Each color has darker and lighter variants available as CSS variables (e.g., `--primary-dark-color`, `--primary-light-color`).

## Customizing the Theme

To make global theme changes:

1. Modify the variables in `primevue-variables.scss`
2. Update component-specific styles in `primevue-theme.scss`

For component-level styling, use scoped styles in your `.vue` files:

```html
<style lang="scss" scoped>
/* Component-specific styles here */
</style>
```

## Best Practices

1. Use CSS variables instead of hardcoded color values
2. Utilize PrimeVue's built-in components wherever possible
3. Gradually migrate from Bootstrap classes to PrimeVue equivalents
4. Maintain consistent spacing using the predefined utility classes
5. Check component appearance in both light and dark modes (when implemented)