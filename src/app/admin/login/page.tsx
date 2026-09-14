'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@tav-coffee.ru');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка входа');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0705] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[#D9A76A]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-700/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-[#140E0B]/90 border border-[#D9A76A]/25 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl space-y-7">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D9A76A]/20 to-transparent border border-[#D9A76A]/30 p-2 shadow-inner mx-auto">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src="/images/logo.jpg"
                  alt="ТАВ"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-white">
                Панель управления
              </h1>
              <p className="text-xs text-[#8E8276] mt-1 font-mono">
                ТАВ Specialty Coffee Roasters
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                Email администратора
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8276]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tav-coffee.ru"
                  className="w-full rounded-xl bg-[#1E1510] border border-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D9A76A] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C4B9AD]">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8276]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-[#1E1510] border border-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-[#D9A76A] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C2905A] via-[#D9A76A] to-[#E5CBA8] hover:brightness-105 active:scale-[0.98] py-3.5 text-sm font-bold text-[#0E0A08] shadow-[0_0_25px_rgba(217,167,106,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Вход в систему...</span>
              ) : (
                <>
                  <span>Войти в админ-панель</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick info hint */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8E8276]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Защищенная сессия</span>
            </span>
            <span>v1.0 (Prisma & Supabase)</span>
          </div>

        </div>
      </div>
    </div>
  );
}
