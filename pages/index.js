import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="mainPage">
      <Head>
        <title>Home | 0xbara</title>
      </Head>
      <main className="main">
        <h1>0xbara</h1>
        <p>Offsec, Opsec, Threat Intel</p>
        <Link href="/posts">posts</Link>
      </main>
    </div>
  );
}