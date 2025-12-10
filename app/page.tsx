import { Button } from "./components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/Card";
import Link from "next/link";

const features = [
  {
    title: "Secure by design",
    desc: "Shamir Secret Sharing keeps your private key split and safe.",
  },
  {
    title: "Guardian workflows",
    desc: "Invite trusted guardians, track approvals, and recover seamlessly.",
  },
  {
    title: "Zero-knowledge UX",
    desc: "Client-side encryption and share handling to keep control with you.",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="pointer-events-none absolute -left-10 top-10 h-64 w-64 rounded-full bg-indigo-300 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-32 h-64 w-64 rounded-full bg-cyan-300 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-pink-300 blur-3xl" />
      </div>

      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:flex-row md:items-center md:py-16 lg:py-20 md:px-6">
        <div className="flex-1 space-y-6">
          <p className="inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-indigo-700 shadow-sm backdrop-blur">
            Next-gen wallet recovery
          </p>
          <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Recover crypto wallets{" "}
            <span className="text-gradient">securely & beautifully</span>.
          </h1>
          <p className="text-lg text-gray-700">
            Split, store, and recover keys with confidence. Bring your guardians
            together with a smooth, modern experience.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="shadow-lg shadow-indigo-200">
                Get started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Log in
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-3">
            <div className="rounded-lg border border-white/70 bg-white/70 p-3 backdrop-blur">
              Zero custody
            </div>
            <div className="rounded-lg border border-white/70 bg-white/70 p-3 backdrop-blur">
              Guardian approvals
            </div>
            <div className="rounded-lg border border-white/70 bg-white/70 p-3 backdrop-blur">
              Google & email login
            </div>
          </div>
        </div>
        <div className="flex-1">
          <Card className="glass shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Recovery snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gradient-to-br from-indigo-500 via-cyan-500 to-emerald-400 p-6 text-white shadow-lg">
                <p className="text-sm opacity-80">Session status</p>
                <div className="mt-2 text-3xl font-semibold">In progress</div>
                <div className="mt-1 text-sm opacity-80">
                  Guardians responding: 3/5
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  {["Alice", "Bob", "Charlie"].map((name, i) => (
                    <div
                      key={name}
                      className="rounded-md bg-white/15 px-3 py-2 shadow-sm backdrop-blur"
                    >
                      <div className="text-xs uppercase opacity-80">
                        Guardian {i + 1}
                      </div>
                      <div className="font-medium">{name}</div>
                      <div className="text-[11px] text-emerald-100">Approved</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border bg-white/80 p-4 text-sm text-gray-700 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Security grade</span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                    A+
                  </span>
                </div>
                <ul className="mt-3 space-y-2 text-gray-600">
                  <li>• Shamir split: 5 shares / threshold 3</li>
                  <li>• Encrypted at rest with rotating salt</li>
                  <li>• Audit trail for guardian approvals</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            Built for confidence
          </h2>
          <Link href="/dashboard" className="text-sm text-indigo-600 underline">
            View dashboard
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="card-raise bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">{f.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}