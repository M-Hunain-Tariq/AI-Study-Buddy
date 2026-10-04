export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#07111f] p-5 sm:p-8 text-slate-100">
      <div className="mx-auto max-w-[1480px] space-y-5">
        <div className="h-12 w-56 animate-pulse rounded-2xl bg-white/[0.06]" />
        <div className="h-[260px] animate-pulse rounded-[28px] border border-white/[0.08] bg-white/[0.035]" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-28 animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.035]" />)}
        </div>
      </div>
    </main>
  );
}
