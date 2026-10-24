import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  X,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchCustomers, SearchCustomerResult } from '../../lib/api';
import { DEMO_RECENT_INSIGHTS } from '../../data/demoData';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchCustomerResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchCustomers(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
      setShowSearchDropdown(true);
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCustomer = (item: SearchCustomerResult) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    navigate(`/customer-experience?search=${encodeURIComponent(item.accountName)}`);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0d121c]/90 backdrop-blur-md border-b border-[#1a2336] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile trigger & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-slate-100 tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden md:block text-xs text-slate-400 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Global Search & Actions */}
      <div className="flex items-center gap-3">
        {/* Global Search Input */}
        <div ref={searchContainerRef} className="relative w-48 sm:w-72 lg:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setShowSearchDropdown(true);
              }}
              placeholder="Search customers, segments and insights..."
              className="w-full bg-[#111726] border border-[#1f2a3f] rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowSearchDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown preview */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#111726] border border-[#24314c] rounded-xl shadow-2xl shadow-black/80 py-2 z-50 max-h-80 overflow-y-auto">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-[#1f2a3f] flex items-center justify-between">
                <span>Matching Accounts ({searchResults.length})</span>
                {isSearching && <span className="text-indigo-400">Searching...</span>}
              </div>

              {searchResults.length === 0 && !isSearching ? (
                <div className="px-4 py-6 text-center text-xs text-slate-400">
                  No accounts or segments found matching "{searchQuery}"
                </div>
              ) : (
                <div className="divide-y divide-[#1f2a3f]/50">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectCustomer(item)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/60 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-medium text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                          {item.accountName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{item.id}</span>
                          <span>•</span>
                          <span>{item.segment}</span>
                          <span>•</span>
                          <span>{formatCurrency(item.monthlySpend)}/mo</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          size="sm"
                          variant={
                            item.riskLevel === 'High'
                              ? 'high'
                              : item.riskLevel === 'Medium'
                              ? 'medium'
                              : 'low'
                          }
                        >
                          {item.riskLevel} Risk
                        </Badge>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Icon with Popover */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#111726] border border-[#24314c] rounded-xl shadow-2xl shadow-black/80 py-2 z-50">
              <div className="px-4 py-2 border-b border-[#1f2a3f] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">
                    Intelligence Alerts
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Real-time customer risk signals
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#1f2a3f]/50">
                {DEMO_RECENT_INSIGHTS.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-300">
                        {alert.category}
                      </span>
                      <span className="text-slate-500">{alert.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-snug">
                      {alert.summary}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-indigo-400 font-mono">
                        {alert.customerId}
                      </span>
                      <Badge
                        size="sm"
                        variant={alert.severity === 'high' ? 'high' : 'medium'}
                      >
                        {alert.metric}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-[#1f2a3f] text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/retention');
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  View Retention Intelligence Action Queue →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Area - STRICT REQUIREMENT: Only User / CX Analyst */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#1a2336]">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
            U
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-medium text-slate-200 leading-tight">
              User
            </span>
            <span className="text-[10px] text-slate-400 leading-tight">
              CX Analyst
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};