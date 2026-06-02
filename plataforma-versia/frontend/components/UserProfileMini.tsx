'use client';

import { useEffect, useState } from 'react';
import { getClientUser, getUserInitials, DEFAULT_USER, type VersiaUser } from '@/lib/clientUser';

export const USER_PROFILE_IMAGE = "https://plus.unsplash.com/premium_photo-1692241091501-984a8a0c35ef?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE2fHx8ZW58MHx8fHx8";

export function UserProfileMini() {
  const [user, setUser] = useState<VersiaUser>(DEFAULT_USER);

  useEffect(() => {
    setUser(getClientUser());
  }, []);

  if (user.role === 'company') {
    return (
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#63E3FF] to-[#7A2CFF] border border-white/10 flex items-center justify-center text-white text-sm font-bold">
          {getUserInitials(user.name)}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{user.company ?? user.name}</p>
          <p className="text-white/40 text-xs truncate">{user.email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <img
        src={USER_PROFILE_IMAGE}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover border border-white/10"
      />
      <div className="min-w-0">
        <p className="text-white text-sm font-medium truncate">{user.name}</p>
        <p className="text-white/40 text-xs truncate">{user.email}</p>
      </div>
    </div>
  );
}
