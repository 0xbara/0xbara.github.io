import Link from 'next/link';

export default function Home() {
  return (
    <div className="mainPage">
      <main className="main">
        <h1>0xbara</h1>
        <p>Offsec, Opsec, Threat Intel</p>
        <Link href="/posts">posts</Link>
      </main>
    </div>
  );
}