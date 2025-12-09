export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-gradient-to-r from-slate-900/60 via-slate-900/50 to-indigo-900/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-sm text-gray-200 md:flex-row md:items-center md:justify-between md:px-6">
        <span className="font-medium text-gray-100">
          © {new Date().getFullYear()} Wallet Recovery
        </span>
        <span className="text-gray-300">
          Secure recovery with Shamir Secret Sharing
        </span>
      </div>
    </footer>
  );
}


