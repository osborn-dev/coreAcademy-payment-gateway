import AuthForm from "@/Components/platform/AuthForm";

export const metadata = { title: "Create account — CoreAcademy" };

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const callbackUrl = sp?.callbackUrl ?? "/";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <AuthForm mode="signup" callbackUrl={callbackUrl} />
    </main>
  );
}
