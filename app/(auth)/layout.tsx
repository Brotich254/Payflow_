export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-8">
            PayFlow
          </h1>
          {children}
        </div>
      </div>
    </div>
  )
}
