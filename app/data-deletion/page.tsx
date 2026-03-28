export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-[#191919] text-white px-6 py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Data Deletion Instructions</h1>
      <p className="text-neutral-400 text-sm mb-8">Last updated: March 28, 2025</p>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">How to Delete Your Data</h2>
        <p className="text-neutral-400 text-sm leading-relaxed mb-4">
          If you signed in to VeloScribe using Facebook and would like to delete your data,
          you can do so by following these steps:
        </p>
        <ol className="list-decimal list-inside text-neutral-400 text-sm space-y-2">
          <li>Send an email to <a href="mailto:azrilluthfimulyadi@gmail.com" className="text-white underline">azrilluthfimulyadi@gmail.com</a> with the subject <strong className="text-white">"Data Deletion Request"</strong></li>
          <li>Include the email address associated with your VeloScribe account</li>
          <li>We will process your request within 30 days and confirm via email</li>
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">What Gets Deleted</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Upon request, we will permanently delete your account, profile information, and all
          associated data from our systems.
        </p>
      </section>
    </div>
  )
}