import React from 'react';
import {
  LayoutDashboard,
  SlidersHorizontal,
  ArrowLeftRight,
  PieChart,
  CalendarClock,
  TrendingUp,
  Target,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onSelectTab }) => {
  const items: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'simulator',
      label: 'Simulate',
      icon: <SlidersHorizontal className="w-5 h-5" />,
    },
    {
      id: 'transactions',
      label: 'Ledger',
      icon: <ArrowLeftRight className="w-5 h-5" />,
    },
    {
      id: 'budget',
      label: 'Budget',
      icon: <PieChart className="w-5 h-5" />,
    },
    {
      id: 'commitments',
      label: 'Bills',
      icon: <CalendarClock className="w-5 h-5" />,
    },
    {
      id: 'insights',
      label: 'Forecast',
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#101827] border-t border-slate-800 px-2 py-1.5 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'text-[#B8F36B]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={isActive ? 'scale-110 transition-transform' : ''}>
                {item.icon}
              </div>
              <span className="text-[10px] mt-0.5 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
