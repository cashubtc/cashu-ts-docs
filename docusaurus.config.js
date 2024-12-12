module.exports = {
  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Jersey+20&display=swap',
      rel: 'stylesheet',
    },
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
      darkMode: {
        cssVars: {
          'background-color': 'hsla(260,40%,5%,1)',
          '--ifm-background-color': 'hsla(260,40%,5%,1)',
          '--ifm-background-surface-color': 'hsla(260,35%,8%,1)',
          '--ifm-navbar-background-color': 'hsla(260,40%,5%,0.8)',
          '--ifm-color-primary': '#c084fc',
          '--ifm-color-primary-dark': '#a855f7',
          '--ifm-color-primary-darker': '#9333ea',
          '--ifm-color-primary-darkest': '#7e22ce',
          '--ifm-color-primary-light': '#d8b4fe',
          '--ifm-color-primary-lighter': '#e9d5ff',
          '--ifm-color-primary-lightest': '#f3e8ff',
          '--ifm-toc-border-color': 'rgba(147,51,234,0.3)',
          '--ifm-color-content': '#f9fafb',
          '--ifm-color-content-secondary': '#a1a1aa',
        }
      }
    }
  }
}; 