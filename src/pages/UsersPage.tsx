import { useState } from 'react';
import {
  Users, 
  Plus, 
  Trash2, 
  Edit,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function UsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin SONEDE', email: 'admin@sonede.tn', role: 'Administrateur', status: 'Actif' },
    { id: 2, name: 'Ingénieur Durant', email: 'ing@sonede.tn', role: 'Ingénieur', status: 'Actif' },
    { id: 3, name: 'Technicien Leclerc', email: 'tech@sonede.tn', role: 'Technicien', status: 'Inactif' },
  ]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  // We'll filter on every render for simplicity
  const computedFilteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(u => 
      u.id === id ? {...u, status: u.status === 'Actif' ? 'Inactif' : 'Actif'} : u
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Gestion des utilisateurs</h1>
          <p className="text-slate-400 text-sm mt-0.5">Administrez les comptes et les permissions</p>
        </div>
        <Button onClick={() => {/* Open add user modal */}} className="bg-cyan-500 hover:bg-cyan-600">
          <Plus className="mr-2 h-4 w-4" /> Nouvel utilisateur
        </Button>
      </div>

      <div className="page-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Input
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr>
                <th className="px-4 py-3 text-slate-400 text-sm font-medium">Nom</th>
                <th className="px-4 py-3 text-slate-400 text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-slate-400 text-sm font-medium">Rôle</th>
                <th className="px-4 py-3 text-slate-400 text-sm font-medium">Statut</th>
                <th className="px-4 py-3 text-slate-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/5">
              {computedFilteredUsers.map(user => (
                <tr key={user.id} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white">{user.name}</td>
                  <td className="px-4 py-3 text-slate-300">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${user.role === 'Administrateur' ? 'bg-blue-500/20 text-blue-400' : user.role === 'Ingénieur' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-violet-500/20 text-violet-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${user.status === 'Actif' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 flex gap-2">
                    <Button onClick={() => {/* Open edit user modal */}} variant="ghost" size="icon">
                      <Edit className="h-4 w-4 text-cyan-400" />
                    </Button>
                    <Button onClick={() => handleToggleStatus(user.id)} variant="ghost" size="icon">
                      {user.status === 'Actif' ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                    <Button onClick={() => handleDelete(user.id)} variant="ghost" size="icon" className="text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {computedFilteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-slate-400">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}