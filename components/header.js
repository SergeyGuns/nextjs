import Link from "next/link";
function Header() {
  return (
    <header>
      <Link href="/">
        <a>Go to Home</a>
      </Link>
      <Link href="/about">
        <a>Go to About Me</a>
      </Link>
      <Link href="/add-user">
        <a>Go to Add User</a>
      </Link>
      <h1>Next.js Example on Now 2.0</h1>
    </header>
  );
}

export default Header;
