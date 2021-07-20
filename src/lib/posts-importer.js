import fs from "fs";
import path from "path";
import { compile } from "mdsvex";

export const getPostsRawBody = () => {
  const __dirname = path.resolve();
  const location = path.join(__dirname, "src/routes/posts");

  const directories = fs
    .readdirSync(location)
    .filter((directory) =>
      fs.lstatSync(`${location}/${directory}`).isDirectory()
    );

  const posts = [];

  directories.forEach((directory) => {
    const post = `${location}/${directory}/index.md`;
    if (fs.existsSync(post)) {
      const postRawBody = fs.readFileSync(post, { encoding: "utf-8" });
      posts.push({ slug: directory, postRawBody });
    }
  });

  return posts;
};

export const getPosts = async (postsContent) => {
  const posts = [];

  for await (post of postsContent) {
    const { postRawBody, slug } = post;
    const parsedPost = await compile(postRawBody);
    posts.push({ slug, ...parsedPost.data.fm });
  }

  return posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
};
