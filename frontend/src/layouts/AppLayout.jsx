import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import MobileNav from '@/components/MobileNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-white transition-colors duration-500">
      <MobileNav />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="min-w-0 flex-1 overflow-hidden px-3 py-4 sm:px-4 lg:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}