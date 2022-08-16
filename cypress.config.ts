// eslint-disable-next-line node/no-unpublished-import
import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'nxomxn',
  chromeWebSecurity: false,
  video: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  defaultCommandTimeout: 15000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
