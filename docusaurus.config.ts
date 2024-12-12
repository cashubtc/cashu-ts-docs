import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Cashu-TS Docs",
  tagline: "A TypeScript library for building Cashu wallets",
  favicon: "img/favicon.ico",
  plugins: [
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ],

  url: "https://cashubtc.github.io/",
  baseUrl: "/cashu-ts-docs/",

  organizationName: "cashubtc",
  projectName: "cashu-ts-docs",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Cashu TS",
      logo: {
        alt: "Cashu-TS Logo",
        src: "img/tslogo.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: 'https://github.com/cashubtc/cashu-ts',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    // announcementBar: {
    //   id: "wip",
    //   content: "These docs are a WORK IN PROGRESS.",
    //   backgroundColor: "#18181b",
    //   textColor: "#fafafa",
    //   isCloseable: false,
    // },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
