# OWASP Threat Dragon Site

This is a Vue project that serves as the front end of the OWASP Threat Dragon website project,
and also provides the electron desktop project

## Project setup

`npm install`

### Compiles and hot-reloads for development

`npm run dev`

### Compiles and minifies for production

`npm run build`

### Analyze bundle size

`npm run build:analyze`

### Builds the desktop application

`npm run build:desktop`

### Runs the desktop application for development

`npm run start:desktop`

Clean the distribution with

`npm run clean`

### Run unit tests

`npm test` (uses optimized fast test configuration)

For continuous testing:

`npm run test:fast:watch`

For test coverage:

`npm run test:fast:coverage`

For visual test interface:

`npm run test:fast:ui`

Coverage reports are generated using Vitest's built-in coverage functionality.
This provides better coverage for Vue components than the previous Jest setup.

See [Test Optimization Guide](tests/TEST_OPTIMIZATION.md) for details on the optimized test infrastructure.

### Run e2e tests

`npm run test:e2e`

### Lints and fixes files

`npm run lint`

## Build Performance

This project uses Vite for fast builds and development:

- Development server starts in milliseconds
- Hot Module Replacement (HMR) is nearly instantaneous
- Production builds use aggressive code splitting and optimization
- Smart dependency pre-bundling reduces rebuild times

## Styles

SCSS is used. For most things, you can use a scoped scss style block inside your `.vue` file.
For global variables, put it in the appropriately named file in the `src/styles` directory.
Any variables or mixins defined there will be available in all components.

## Font Awesome

Rather than loading all FA icons, we selectively choose the ones that we need.
These are defined in `src/plugins/fontawesome-vue.js`.
To bring in a new icon, import it from the appropriate node_module, and then add it to the `library.add(...)` call.
You do not need to import anything in your components or pages, they are globally available.

## PrimeVue

This project uses [PrimeVue](https://primevue.org/) as its primary UI component framework.
The migration from Bootstrap-Vue to PrimeVue has been completed as part of the Vue 3 migration.
All components are now using PrimeVue.

## Adding providers

Add a new service named <provider>.provider.js in `src/service/provider`.
See [github.provider.js](src/service/provider/github.provider.js) as an example.
This will need the following:

- `dashboardActions`: An array of objects that describe the actions a user can take from the dashboard
    (after selecting the provider)

## State Management

This project uses [Pinia](https://pinia.vuejs.org/) for state management.
Pinia provides better TypeScript support, more intuitive API, and improved developer experience compared to Vuex.
State is persisted using the `pinia-plugin-persistedstate` plugin.

The migration from Vuex to Pinia has been completed as part of the Vue 3 migration.
