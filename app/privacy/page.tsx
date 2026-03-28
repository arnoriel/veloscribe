export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#191919] text-white px-6 py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-neutral-400 text-sm mb-8">Last updated: March 28, 2026</p>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          We collect information you provide when signing in, including your name and email address
          from third-party providers such as Google and Facebook.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">2. How We Use Your Information</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Your information is used solely to authenticate your account and personalize your experience
          on VeloScribe. We do not sell or share your data with third parties.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">3. Data Storage</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Your data is securely stored using Supabase. We retain your data as long as your account
          is active. You may request deletion at any time.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">4. Contact</h2>
        <p className="text-neutral-400 text-sm leading-relaxed">
          For any privacy-related questions, contact us at{' '}
          <a href="mailto:azrilluthfimulyadi@gmail.com" className="text-white underline">
            azrilluthfimulyadi@gmail.com
          </a>
        </p>
      </section>
    </div>
  )
}