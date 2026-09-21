import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import SectionHeader from '@/components/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { 
  getUsers, 
  subscribeUserSecurity, 
  readmitUser, 
  simulateUserStrike, 
  saveUsers 
} from '@/services/userSecurityService';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Edit3, 
  Trash2, 
  Lock, 
  Unlock, 
  Award, 
  X, 
  Check, 
  UserCheck, 
  SlidersHorizontal,
  AlertTriangle
} from 'lucide-react';
import { playClickSound, playChimeSound, playErrorSound } from '@/utils/soundEffects';

const ROLE_OPTIONS = [
  { value: 'Super Administrator (RBAC)', label: 'Super Administrator (Level 5)', badge: 'ADMIN' },
  { value: 'Security Analyst', label: 'Security Analyst (SecOps)', badge: 'ANALYST' },
  { value: 'Standard Employee', label: 'Standard Employee', badge: 'EMPLOYEE' },
];

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const { pushToast } = useToast();

  const isAdmin = currentUser?.role === 'Super Administrator' || 
                  currentUser?.role === 'Super Administrator (RBAC)' || 
                  currentUser?.email === 'anlinpunneli@gmail.com';

  const [userList, setUserList] = useState(() => getUsers());

  useEffect(() => {
    return subscribeUserSecurity((updated) => {
      setUserList(updated);
    });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Standard Employee',
    clearance: 'Level 1',
    status: 'Active',
  });

  // Filtered Users
  const filteredUsers = userList.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || 
                        (roleFilter === 'ADMIN' && u.role.includes('Admin')) ||
                        (roleFilter === 'ANALYST' && u.role.includes('Analyst')) ||
                        (roleFilter === 'EMPLOYEE' && u.role.includes('Employee'));
    return matchesSearch && matchesRole;
  });

  // Actions
  const handleOpenAddModal = () => {
    if (!isAdmin) {
      playErrorSound();
      pushToast('Access Denied: Super Administrator privileges required', 'danger');
      return;
    }
    playClickSound();
    setFormData({ name: '', email: '', role: 'Standard Employee', clearance: 'Level 1', status: 'Active' });
    setIsAddModalOpen(true);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      pushToast('Please provide both name and email', 'warning');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      clearance: formData.clearance || 'Level 1',
    };

    setUserList([newUser, ...userList]);
    setIsAddModalOpen(false);
    playChimeSound();
    pushToast(`User ${newUser.name} created successfully!`, 'success');
  };

  const handleEditClick = (targetUser) => {
    if (!isAdmin) {
      playErrorSound();
      pushToast('Access Denied: Only Super Admin can edit users', 'danger');
      return;
    }
    playClickSound();
    setEditingUser(targetUser);
    setFormData({
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      clearance: targetUser.clearance || 'Level 1',
      status: targetUser.status || 'Active',
    });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setUserList((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? { ...u, name: formData.name, email: formData.email, role: formData.role, status: formData.status }
          : u
      )
    );

    setEditingUser(null);
    playChimeSound();
    pushToast(`User record for ${formData.name} updated successfully.`, 'success');
  };

  const handlePromoteToAdmin = (targetUser) => {
    if (!isAdmin) {
      playErrorSound();
      pushToast('Access Denied: Only Super Admin can elevate roles', 'danger');
      return;
    }

    playClickSound();
    setUserList((prev) =>
      prev.map((u) =>
        u.id === targetUser.id ? { ...u, role: 'Super Administrator (RBAC)', status: 'Active (Level 5)' } : u
      )
    );
    playChimeSound();
    pushToast(`⚡ ${targetUser.name} has been promoted to Super Administrator (Level 5)!`, 'success');
  };

  const handleReadmitUser = (targetUser) => {
    if (!isAdmin) {
      playErrorSound();
      pushToast('Access Denied: Only Super Administrator can readmit suspended accounts', 'danger');
      return;
    }
    playChimeSound();
    readmitUser(targetUser.email, currentUser?.email || 'anlinpunneli@gmail.com');
    pushToast(`🛡️ Account for "${targetUser.name}" successfully readmitted! Security strikes reset to 0/3. Access reinstated.`, 'success');
  };

  const handleSimulateStrike = (targetUser) => {
    if (!isAdmin) return;
    playClickSound();
    const result = simulateUserStrike(targetUser.email);
    if (result.suspended) {
      playErrorSound();
      pushToast(`🚨 3/3 Strikes Reached: ${targetUser.name} has been placed in quarantine!`, 'danger');
    } else {
      pushToast(`⚡ Test Strike ${result.strikes}/3 added to ${targetUser.name} [Demo Mode]`, 'warning');
    }
  };

  const handleToggleSuspend = (targetUser) => {
    if (!isAdmin) {
      playErrorSound();
      pushToast('Access Denied: Super Admin privilege required', 'danger');
      return;
    }

    if (targetUser.email === 'anlinpunneli@gmail.com') {
      playErrorSound();
      pushToast('Cannot suspend Primary System Owner account!', 'danger');
      return;
    }

    playClickSound();
    if (targetUser.status?.includes('Suspended') || (targetUser.strikes || 0) >= 3) {
      readmitUser(targetUser.email, currentUser?.email || 'anlinpunneli@gmail.com');
      playChimeSound();
      pushToast(`🔓 Account ${targetUser.name} readmitted and unlocked.`, 'success');
    } else {
      const updatedUsers = userList.map((u) => 
        u.id === targetUser.id ? { ...u, status: 'Suspended (Locked)', strikes: 3 } : u
      );
      saveUsers(updatedUsers);
      playErrorSound();
      pushToast(`🔒 Account ${targetUser.name} suspended and tokens revoked.`, 'danger');
    }
  };

  const handleDeleteUser = (targetUser) => {
    if (!isAdmin) {
      playErrorSound();
      pushToast('Access Denied: Only Super Admin can delete users', 'danger');
      return;
    }

    if (targetUser.email === 'anlinpunneli@gmail.com') {
      playErrorSound();
      pushToast('Primary System Owner cannot be deleted!', 'danger');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user ${targetUser.name}?`)) {
      playClickSound();
      setUserList((prev) => prev.filter((u) => u.id !== targetUser.id));
      pushToast(`User ${targetUser.name} permanently removed.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Identity & Access"
        title="User Management Center"
        description="Add, edit, elevate security clearance, or revoke enterprise user access."
      />

      {/* RBAC Status Banner */}
      <div
        className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-3xl border p-5 backdrop-blur-xl transition-all ${
          isAdmin
            ? 'border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_30px_rgba(77,215,255,0.15)]'
            : 'border-amber-400/30 bg-amber-500/10'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
              isAdmin ? 'border-cyan-400/40 bg-cyan-400/20 text-cyan-300' : 'border-amber-400/40 bg-amber-400/20 text-amber-300'
            }`}
          >
            {isAdmin ? <ShieldAlert className="h-6 w-6 animate-pulse" /> : <Lock className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-white text-base">
                {isAdmin ? 'LEVEL 5 SUPER ADMIN PRIVILEGES ACTIVE' : 'READ-ONLY RBAC VIEW'}
              </h3>
              <span className="rounded-md border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-200">
                {currentUser?.email || 'Guest'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isAdmin
                ? 'Full access enabled: Create, Edit, Elevate roles to Admin, Suspend, or Delete enterprise users.'
                : 'Super Administrator privileges are required to modify user roles, permissions, or security clearances.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          disabled={!isAdmin}
          className="flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(77,215,255,0.3)] shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-slate-400">TOTAL USERS</p>
            <p className="text-2xl font-bold text-white font-display mt-1">{userList.length}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
            <Users className="h-5 w-5" />
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-slate-400">SUPER ADMINS</p>
            <p className="text-2xl font-bold text-cyan-300 font-display mt-1">
              {userList.filter((u) => u.role.includes('Admin')).length}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
            <Award className="h-5 w-5" />
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-slate-400">QUARANTINED (3 STRIKES)</p>
            <p className="text-2xl font-bold text-red-400 font-display mt-1">
              {userList.filter((u) => u.status?.includes('Suspended') || (u.strikes || 0) >= 3).length}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/40">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-slate-400">ACTIVE PERSONNEL</p>
            <p className="text-2xl font-bold text-emerald-300 font-display mt-1">
              {userList.filter((u) => !u.status?.includes('Suspended') && (u.strikes || 0) < 3).length}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
            <UserCheck className="h-5 w-5" />
          </div>
        </GlassCard>
      </div>

      {/* Controls & Search */}
      <GlassCard className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400/70"
          />
        </div>

        {/* Role Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-slate-400 mr-1 hidden sm:block" />
          {['ALL', 'ADMIN', 'ANALYST', 'EMPLOYEE'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-medium transition ${
                roleFilter === r
                  ? 'bg-cyan-400 text-black font-bold shadow-[0_0_12px_rgba(77,215,255,0.4)]'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Users Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-white/5 text-slate-300 border-b border-white/10 font-mono text-xs uppercase">
              <tr>
                <th className="px-5 py-4 font-semibold">User</th>
                <th className="px-5 py-4 font-semibold">Role</th>
                <th className="px-5 py-4 font-semibold">Zero-Trust Strikes</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((u) => {
                const isSuperAdminRole = u.role?.includes('Admin') || u.email === 'anlinpunneli@gmail.com';
                const isSuspended = u.status?.includes('Suspended') || (u.strikes || 0) >= 3;

                return (
                  <tr key={u.id} className="hover:bg-cyan-500/5 transition-colors">
                    {/* User Info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                          isSuspended 
                            ? 'bg-gradient-to-br from-red-500 to-rose-700 text-white' 
                            : 'bg-gradient-to-br from-cyan-400 to-blue-600 text-black'
                        }`}>
                          {u.name?.slice(0, 2).toUpperCase() || 'US'}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-base flex items-center gap-2">
                            {u.name}
                            {isSuperAdminRole && (
                              <span className="rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono px-2 py-0.5 border border-amber-400/30 flex items-center gap-1">
                                <Award className="w-3 h-3" /> LEVEL 5
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-medium border ${
                          isSuperAdminRole
                            ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                            : u.role?.includes('Analyst')
                            ? 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                            : 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Zero-Trust Strikes Indicator */}
                    <td className="px-5 py-4">
                      {isSuperAdminRole ? (
                        <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-400/20">
                          EXEMPT (OWNER)
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3].map((num) => {
                              const filled = (u.strikes || 0) >= num;
                              return (
                                <span
                                  key={num}
                                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                                    filled
                                      ? (u.strikes || 0) >= 3
                                        ? 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                                        : 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
                                      : 'bg-slate-800 border border-slate-700'
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <span
                            className={`text-xs font-mono font-bold ${
                              (u.strikes || 0) >= 3
                                ? 'text-red-400'
                                : (u.strikes || 0) > 0
                                ? 'text-amber-300'
                                : 'text-slate-400'
                            }`}
                          >
                            {(u.strikes || 0)}/3 Strikes
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono ${
                          isSuspended
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${isSuspended ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
                        {isSuspended ? 'Suspended (Quarantined)' : u.status || 'Active'}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Readmit Account Button (Shown when user is suspended or 3 strikes) */}
                        {isSuspended ? (
                          <button
                            onClick={() => handleReadmitUser(u)}
                            disabled={!isAdmin}
                            title="Readmit & Reinstate User Access"
                            className="flex items-center gap-1.5 rounded-xl border border-emerald-400 bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-400 hover:text-black transition shadow-[0_0_15px_rgba(52,211,153,0.35)] cursor-pointer"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            <span>Readmit Account</span>
                          </button>
                        ) : null}

                        {/* Test Strike Button (Demo mode for Super Admin testing) */}
                        {!isSuperAdminRole && !isSuspended && (
                          <button
                            onClick={() => handleSimulateStrike(u)}
                            disabled={!isAdmin}
                            title="Simulate prompt violation strike on account (Demo Test)"
                            className="flex items-center gap-1 rounded-xl border border-amber-400/30 bg-amber-400/10 px-2.5 py-1.5 text-xs font-mono text-amber-300 hover:bg-amber-400 hover:text-black transition cursor-pointer"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            <span>+Strike</span>
                          </button>
                        )}

                        {/* Promote to Admin Button */}
                        {!isSuperAdminRole && !isSuspended && (
                          <button
                            onClick={() => handlePromoteToAdmin(u)}
                            disabled={!isAdmin}
                            title="Promote to Super Administrator (Level 5)"
                            className="flex items-center gap-1 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-400 hover:text-black transition disabled:opacity-40"
                          >
                            <Award className="h-3.5 w-3.5" />
                            <span>Promote</span>
                          </button>
                        )}

                        {/* Suspend / Unlock Button */}
                        <button
                          onClick={() => handleToggleSuspend(u)}
                          disabled={!isAdmin}
                          title={isSuspended ? 'Unlock / Reactivate User' : 'Suspend & Lock User'}
                          className={`rounded-xl border p-1.5 transition disabled:opacity-40 cursor-pointer ${
                            isSuspended
                              ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400 hover:text-black'
                              : 'border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400 hover:text-black'
                          }`}
                        >
                          {isSuspended ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditClick(u)}
                          disabled={!isAdmin}
                          title="Edit User Record"
                          className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white transition disabled:opacity-40"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteUser(u)}
                          disabled={!isAdmin}
                          title="Delete User"
                          className="rounded-xl border border-red-500/20 bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500 hover:text-white transition disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Enterprise RBAC Permissions Matrix */}
      <GlassCard className="p-6 border-slate-800">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Enterprise Role-Based Access Control (RBAC) Matrix</h4>
            <p className="text-xs text-slate-400">Strict zero-trust capability assignments mapped across operational clearances.</p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">System Permission & Scope</th>
                <th className="py-2.5 px-3 text-center">Super Admin (L5)</th>
                <th className="py-2.5 px-3 text-center">Security Analyst (L3)</th>
                <th className="py-2.5 px-3 text-center">Standard Employee (L1)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {[
                { perm: 'AI Assistant Prompt & Inference', admin: true, analyst: true, user: true },
                { perm: 'Enterprise Document Intelligence & RAG', admin: true, analyst: true, user: true },
                { perm: 'Live Zero-Trust Guardrail Telemetry', admin: true, analyst: true, user: false },
                { perm: 'Jailbreak Forensic Payload Inspection', admin: true, analyst: true, user: false },
                { perm: 'SIEM Connector & Webhook Streaming', admin: true, analyst: false, user: false },
                { perm: 'Guardrail Policy & Rule Tuning', admin: true, analyst: false, user: false },
                { perm: 'Audit Trail Forensic CSV/JSON Export', admin: true, analyst: true, user: false },
                { perm: 'User Account Provisioning & Deprovisioning', admin: true, analyst: false, user: false },
              ].map((row) => (
                <tr key={row.perm} className="hover:bg-slate-900/50 transition">
                  <td className="py-2.5 px-3 font-medium text-slate-200">{row.perm}</td>
                  <td className="py-2.5 px-3 text-center">
                    {row.admin ? (
                      <span className="inline-flex items-center text-emerald-400 font-bold"><Check className="h-4 w-4" /></span>
                    ) : (
                      <span className="inline-flex items-center text-slate-600"><X className="h-4 w-4" /></span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.analyst ? (
                      <span className="inline-flex items-center text-emerald-400 font-bold"><Check className="h-4 w-4" /></span>
                    ) : (
                      <span className="inline-flex items-center text-slate-600"><X className="h-4 w-4" /></span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.user ? (
                      <span className="inline-flex items-center text-emerald-400 font-bold"><Check className="h-4 w-4" /></span>
                    ) : (
                      <span className="inline-flex items-center text-slate-600"><X className="h-4 w-4" /></span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ADD USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <GlassCard className="relative w-full max-w-lg p-6 futuristic-panel border-cyan-400/30">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <UserPlus className="h-6 w-6 text-cyan-400" />
              <div>
                <h3 className="font-display text-lg font-bold text-white">ADD NEW ENTERPRISE USER</h3>
                <p className="text-xs text-slate-400">Configure credentials and assign RBAC permissions</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="sarah.jenkins@sentinel.local"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Assign Enterprise Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-cyan-400 px-5 py-2 text-xs font-bold text-black hover:bg-cyan-300"
                >
                  Create User
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <GlassCard className="relative w-full max-w-lg p-6 futuristic-panel border-cyan-400/30">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Edit3 className="h-6 w-6 text-cyan-400" />
              <div>
                <h3 className="font-display text-lg font-bold text-white">EDIT USER RECORD</h3>
                <p className="text-xs text-slate-400">Modify profile, email, or elevate user role</p>
              </div>
            </div>

            <form onSubmit={handleUpdateUser} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Enterprise Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-cyan-400 px-5 py-2 text-xs font-bold text-black hover:bg-cyan-300 flex items-center gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}