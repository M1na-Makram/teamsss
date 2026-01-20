import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check } from 'lucide-react';

const SearchableSelect = ({ 
    options = [], 
    value = [], // Array of IDs
    onChange, 
    placeholder = "Search...",
    label = "Select options",
    multiple = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    // Filter options based on search
    const filteredOptions = options.filter(opt => 
        opt.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        opt.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle outside click to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (option) => {
        if (multiple) {
            if (value.includes(option.id)) {
                onChange(value.filter(id => id !== option.id));
            } else {
                onChange([...value, option.id]);
            }
        } else {
            onChange([option.id]);
            setIsOpen(false);
        }
    };

    const removeTag = (e, id) => {
        e.stopPropagation();
        onChange(value.filter(v => v !== id));
    };

    const getSelectedLabels = () => {
        return value.map(id => {
            const opt = options.find(o => o.id === id);
            return opt ? opt.name : id;
        });
    };

    return (
        <div ref={wrapperRef} className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            
            {/* Input Trigger */}
            <div 
                onClick={() => setIsOpen(true)}
                className="w-full min-h-[50px] bg-white/5 border border-white/10 rounded-lg px-4 py-3 cursor-pointer focus-within:ring-2 focus-within:ring-primary/50 transition-all flex flex-wrap gap-2 items-center"
            >
                {value.length === 0 && (
                    <span className="text-gray-500">{placeholder}</span>
                )}

                {value.map(id => {
                   const opt = options.find(o => o.id === id);
                   return (
                       <span key={id} className="inline-flex items-center gap-1 bg-primary/20 text-primary text-xs font-semibold px-2 py-1 rounded-md border border-primary/30">
                           {opt?.name || id}
                           <X 
                               className="w-3 h-3 cursor-pointer hover:text-white" 
                               onClick={(e) => removeTag(e, id)}
                           />
                       </span>
                   );
                })}

                <div className="flex-1 min-w-[60px]">
                    <input 
                        type="text"
                        className="w-full bg-transparent border-none text-white focus:outline-none text-sm placeholder-gray-600"
                        placeholder={value.length > 0 ? "" : ""}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <div 
                                key={option.id}
                                onClick={() => handleSelect(option)}
                                className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors ${
                                    value.includes(option.id) ? 'bg-primary/10 text-primary' : 'text-gray-300'
                                }`}
                            >
                                <div>
                                    <p className="font-medium">{option.name}</p>
                                    {option.code && <p className="text-xs opacity-60">{option.code}</p>}
                                </div>
                                {value.includes(option.id) && <Check className="w-4 h-4" />}
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No options found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
