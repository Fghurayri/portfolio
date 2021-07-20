const config = {
  extensions: [".svelte.md", ".md", ".svx"],

  smartypants: {
    dashes: "oldschool",
  },

  layout: {
    posts: "./src/lib/components/post-layout.svelte",
  },

  remarkPlugins: [],
  rehypePlugins: [],
};

export default config;
