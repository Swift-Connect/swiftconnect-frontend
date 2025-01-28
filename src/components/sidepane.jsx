import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Sidepane = () => {
  const [user, setUser] = useState(null); // State to store user data
  const pathname = usePathname();

  useEffect(() => {
    // Retrieve and parse user data from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Pay Bills', path: '/pay-bills' },
    { name: 'Cards', path: '/cards' },
    { name: 'Reward', path: '/reward' },
    { name: 'Settings', path: '/settings' },
    { name: 'Developer API', path: '/developer-api' },
  ];

  return (
    <div className="w-64 bg-[#FAFAFA] shadow-lg h-screen fixed flex flex-col justify-between">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0E1318] p-6">Dashboard</h2>
        <ul className="mt-4">
          {menuItems.map((item) => (
            <li key={item.name} className="my-2">
              <Link
                href={item.path}
                className={`block px-4 py-3 transition duration-200 ${
                  pathname.includes(item.path)
                    ? 'bg-[#0E1318] text-white'
                    : 'text-[#0E1318] hover:bg-[#00613a48] hover:text-[#000e08]'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* User Info Box */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md mx-4">
        {user ? (
          <div>
            <div className="flex items-center mt-4">
              <img
                src={user.profileimage}
                alt="User Avatar"
                className="w-12 h-12 rounded-full mr-3 border-2 border-gray-300"
                onError={(e) => (e.target.src = '/path/to/default-avatar.jpg')} // Fallback
              />
              <div className="flex flex-col">
                <span className="text-sm text-[#0E1318]">{user.username || '--'}</span>
                <span className="text-xs text-[#9CA3AF]">
                  {user.kyc_verified ? 'KYC Verified' : 'KYC Not Verified'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#6B7280]">Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default Sidepane;
