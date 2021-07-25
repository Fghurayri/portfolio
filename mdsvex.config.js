import slug from "remark-slug";

const config = {
  extensions: [".svelte.md", ".md", ".svx"],

  smartypants: {
    dashes: "oldschool",
  },

  layout: {
    posts: "./src/lib/components/post-layout.svelte",
  },

  remarkPlugins: [slug],
  rehypePlugins: [],
};

export default config;
