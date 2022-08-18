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
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
