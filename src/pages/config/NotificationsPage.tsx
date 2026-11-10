import React from 'react';
import { Button } from '@/components/ui/button';

export function NotificationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-4">Notifications</h1>
      <p className="text-slate-400 mb-6">Paramétrez les canaux et règles de notification (email, SMS, webhook).</p>

      <div className="rounded-xl p-6 bg-slate-900 border border-white/6">
        <h2 className="font-semibold text-white mb-2">Canaux</h2>
        <p className="text-slate-400 text-sm mb-4">Activez ou désactivez les canaux de notification.</p>
        <Button>Gérer les canaux</Button>
      </div>
    </div>
  );
}
