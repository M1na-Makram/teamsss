import React from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

// Specializations - only for Computer Science
const SPECIALIZATIONS = {
  'Computer Science': [
    'Cyber Security Program',
    'Intelligent Systems',
    'Data Science & Artificial Intelligence'
  ]
};

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onReset, 
  faculties = [], 
  courses = [] 
}) => {
  // Numeric groups 1-10
  const GROUPS = ['All Groups', ...Array.from({ length: 10 }, (_, i) => String(i + 1))];

  // Check if specialization should be shown (only for Computer Science)
  const showSpecialization = filters.faculty === 'Computer Science';
  
  // Get specialization options based on selected faculty
  const specializationOptions = showSpecialization ? SPECIALIZATIONS['Computer Science'] : [];

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Filter & Search</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search teams..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Faculty Filter (from database) */}
        <div className="relative">
          <select
            value={filters.faculty || ''}
            onChange={(e) => {
              onFilterChange('faculty', e.target.value);
              // Reset specialization when faculty changes
              if (e.target.value !== 'Computer Science') {
                onFilterChange('specialization', '');
              }
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer pr-10"
          >
            <option value="" className="bg-[#0f172a]">All Faculties</option>
            {faculties.map(faculty => (
              <option key={faculty} value={faculty} className="bg-[#0f172a]">{faculty}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Specialization Filter (conditional - only for CS) */}
        {showSpecialization && (
          <div className="relative">
            <select
              value={filters.specialization || ''}
              onChange={(e) => onFilterChange('specialization', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer pr-10"
            >
              <option value="" className="bg-[#0f172a]">All Specializations</option>
              {specializationOptions.map(spec => (
                <option key={spec} value={spec} className="bg-[#0f172a]">{spec}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        )}

        {/* Course Filter (from database) */}
        <div className="relative">
          <select
            value={filters.course || ''}
            onChange={(e) => onFilterChange('course', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer pr-10"
          >
            <option value="" className="bg-[#0f172a]">All Courses</option>
            {courses.map(course => (
              <option key={course.code} value={course.code} className="bg-[#0f172a]">
                {course.code} - {course.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Group (Lecture) Filter - Numeric 1-10 */}
        <div className="relative">
          <select
            value={filters.group || ''}
            onChange={(e) => onFilterChange('group', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer pr-10"
          >
            <option value="" className="bg-[#0f172a]">All Groups</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num} className="bg-[#0f172a]">Group {num}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Reset Button */}
      {(filters.search || filters.course || filters.faculty || filters.specialization || filters.group) && (
        <button
          onClick={onReset}
          className="mt-4 text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default FilterPanel;
