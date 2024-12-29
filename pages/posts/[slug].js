import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import md from 'markdown-it';
import Link from 'next/link';

export default function Post({ frontmatter, content }) {
  return (
    <div className="mainPage">
      <div className="post-content">
        <Link href="/posts" className="back-link">back</Link>
        <h1>{frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'));
  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(path.join('posts', slug + '.md'), 'utf-8');
  const { data: frontmatter, content } = matter(markdownWithMeta);
  const htmlContent = md().render(content);

  return {
    props: {
      frontmatter,
      slug,
      content: htmlContent,
    },
  };
}
