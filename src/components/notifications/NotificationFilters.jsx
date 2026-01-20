import React from 'react';
import { Filter } from 'lucide-react';

const NotificationFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'team_request', label: 'Team Requests' },
    { id: 'admin_message', label: 'Admin Messages' },
    { id: 'new_team', label: 'New Teams' },
    { id: 'rating', label: 'Ratings' },
    { id: 'unread', label: 'Unread Only' },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Filter Notifications</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === filter.id
                ? 'bg-primary text-white'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationFilters;
