import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  username: string;
  password: string;
}

const USERS: User[] = [
  { id: '1', username: 'bessem', password: '0000' },
  { id: '2', username: 'samar', password: '0000' },
  { id: '3', username: 'soned', password: '0000' },
  { id: '4', username: 'certe', password: '0000' },
];

export function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-4">Utilisateurs</h1>
      <p className="text-slate-400 mb-6">Gérez les comptes, rôles et permissions.</p>

      <div className="rounded-xl p-6 bg-slate-900 border border-white/6">
        <h2 className="font-semibold text-white mb-6">Liste des utilisateurs autorisés</h2>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">Nom d'utilisateur</TableHead>
                <TableHead className="text-slate-400">Mot de passe</TableHead>
                <TableHead className="text-slate-400">Statut</TableHead>
                <TableHead className="text-slate-400">Date d'ajout</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USERS.map((user) => (
                <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/30">
                  <TableCell className="text-white font-semibold">{user.username}</TableCell>
                  <TableCell className="text-slate-400 font-mono">••••••••</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                      Actif
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">Configuration initiale</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <p className="text-xs text-slate-400">
            <strong className="text-cyan-400">Note:</strong> Ces 4 utilisateurs sont configurés dans le système d'authentification centralisé. 
            Ils partagent tous le même mot de passe par défaut configuré lors de l'installation.
          </p>
        </div>
      </div>
    </div>
  );
}
