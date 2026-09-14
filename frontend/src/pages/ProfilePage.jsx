import GlassCard from '@/components/GlassCard';
import SectionHeader from '@/components/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <GlassCard className="p-5">
      <SectionHeader eyebrow="Profile" title="User Profile" description="View account details, change password, and log out securely." />
      <div className="mt-5 grid gap-4 md:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-electric/30 bg-electric/10 text-3xl font-semibold text-electric">{user?.avatar || 'AU'}</div>
          <h3 className="mt-4 text-xl font-semibold text-white">{user?.name}</h3>
          <p className="text-sm text-slate-400">{user?.role}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div>
            <p className="text-sm text-slate-400">Email</p>
            <p className="text-white">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Security Actions</p>
            <div className="mt-3 flex gap-3">
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">Change Password</button>
              <button className="rounded-2xl bg-danger px-4 py-3 text-sm font-medium text-white" onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}