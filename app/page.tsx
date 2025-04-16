import Dashboard from "@/components/dashboard"

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Metrics Performance Dashboard</h1>
      <Dashboard />
    </main>
  )
}
