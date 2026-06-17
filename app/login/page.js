import AuthForm from "@/Components/platform/AuthForm";

export const metadata = { title: "Sign in — CoreAcademy" };

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const callbackUrl = sp?.callbackUrl ?? "/";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <AuthForm mode="login" callbackUrl={callbackUrl} />
    </main>
  );
}
