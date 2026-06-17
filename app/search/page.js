import SearchPanel from "@/Components/platform/SearchPanel";

export const metadata = {
  title: "Search — CoreAcademy",
  description: "Find content and get a personalized learning roadmap.",
};

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q ?? "";

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors">
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            What do you want to learn?
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Search the library and get a roadmap built around your goals.
          </p>
        </div>

        <SearchPanel initialQuery={q} />
      </div>
    </main>
  );
}
