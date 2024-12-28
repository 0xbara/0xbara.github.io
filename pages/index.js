import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'

export default function Home({ posts }) {
  return (
    <div className={styles.container}>
      <main>
        <h1 className={styles.title}>Mi Blog</h1>
        <div className={styles.grid}>
          {posts.map((post) => (
            <div key={post.slug} className={styles.card}>
              <h2>{post.title}</h2>
              <p>{post.date}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDirectory)

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)
    
    return {
      slug: filename.replace('.md', ''),
      title: data.title,
      date: data.date
    }
  })

  return {
    props: {
      posts
    }
  }
}