import Header from "@/Components/Header1";

export default function About() {
    return (
        <>
        <Header />
      <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-4xl p-8 bg-gray-50 rounded-xl shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Why CoreAcademy?</h1>
          <p className="text-gray-600">Your about content here—why CoreAcademy rocks!</p>
        </div>
      </main>
      </>
    );
  }