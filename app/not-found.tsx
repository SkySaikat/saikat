import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[1440px] flex-col justify-center px-5 pt-32 md:px-10">
      <p className="label">404</p>
      <h1 className="display mt-6 text-[clamp(48px,8vw,128px)]">This page does not exist.</h1>
      <Link href="/" className="mt-10 inline-flex h-14 w-fit items-center rounded-full bg-accent px-7 text-[15px] font-medium text-accent-ink">
        Back to the homepage
      </Link>
    </main>
  );
}
