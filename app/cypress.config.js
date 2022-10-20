const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'u696da',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
