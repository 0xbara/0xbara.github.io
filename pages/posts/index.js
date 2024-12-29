import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function Posts({ posts }) {
    return (
      <div className="mainPage">
        <div className="posts-container">
          <Link href="/" className="back-link">back</Link>
          {posts.map((post) => (
            <div key={post.slug} className="post-entry">
              <h2>{post.title}</h2>
              <div className="post-date">{post.date}</div>
              <Link href={`/posts/${post.slug}`}>read</Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    return {
      slug: filename.replace('.md', ''),
      title: data.title,
      date: data.date,
    };
  });

  return {
    props: {
      posts,
    },
  };
}