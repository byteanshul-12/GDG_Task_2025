import React, { useState, useEffect, useMemo } from 'react';
import { Room, FilterState, Building, Amenity, EventCategory, Notification, UniEvent } from '../types';
import { MOCK_ROOMS, INITIAL_FILTERS, MOCK_EVENTS } from '../constants';
import { parseNaturalLanguageQuery } from '../services/geminiService';
import RoomCard from './RoomCard';
import MapView from './MapView';
import NotificationCenter from './NotificationCenter';
import SubscriptionModal from './SubscriptionModal';
import AttendanceCalculator from './AttendanceCalculator';
import { Search, Filter, Sparkles, X, Menu, BellRing, LogOut, Calculator } from 'lucide-react';

// --- Logic Helpers ---

const getCurrentTimeInt = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 8 || hour > 18) return 1000; 
    return (now.getHours() * 100) + now.getMinutes();
};

const getCurrentDay = () => {
    const day = new Date().getDay();
    return (day === 0 || day === 6) ? 1 : day;
};

const checkAvailability = (room: Room, time: number, day: number): { available: boolean, nextClass?: string } => {
    const dailySchedule = room.schedule[day] || [];
    const currentClass = dailySchedule.find(slot => time >= slot.start && time < slot.end);
    
    if (currentClass) {
        return { available: false, nextClass: currentClass.course };
    }
    return { available: true };
};

const getNextFreeTime = (room: Room, time: number, day: number): string | undefined => {
    const dailySchedule = room.schedule[day] || [];
    const currentClass = dailySchedule.find(slot => time >= slot.start && time < slot.end);
    
    if (currentClass) {
        const t = currentClass.end;
        const h = Math.floor(t / 100);
        const m = t % 100;
        return `${h}:${m.toString().padStart(2, '0')}`;
    }
    return undefined;
};

interface DashboardProps {
    onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [rooms] = useState<Room[]>(MOCK_ROOMS);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [currentTime, setCurrentTime] = useState(getCurrentTimeInt());
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subscriptions, setSubscriptions] = useState<EventCategory[]>([
      EventCategory.CAREER, EventCategory.ACADEMIC
  ]);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
       const now = new Date();
       const hour = now.getHours();
       if (hour >= 8 && hour <= 18) {
           setCurrentTime((now.getHours() * 100) + now.getMinutes());
       }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkForEvents = () => {
        const rand = Math.random();
        if (rand > 0.7) { 
            const relevantEvents = MOCK_EVENTS.filter(e => subscriptions.includes(e.category));
            if (relevantEvents.length === 0) return;

            const randomEvent = relevantEvents[Math.floor(Math.random() * relevantEvents.length)];
            const exists = notifications.some(n => n.id === `notif-${randomEvent.id}`);
            
            if (!exists) {
                const newNotification: Notification = {
                    id: `notif-${randomEvent.id}-${Date.now()}`,
                    title: `Upcoming: ${randomEvent.title}`,
                    message: `${randomEvent.description} at ${randomEvent.location}`,
                    timestamp: new Date(),
                    isRead: false,
                    category: randomEvent.category
                };
                setNotifications(prev => [newNotification, ...prev]);
            }
        }
    };

    const notificationInterval = setInterval(checkForEvents, 10000);
    return () => clearInterval(notificationInterval);
  }, [subscriptions, notifications]);


  const filteredRooms = useMemo(() => {
    const day = getCurrentDay();
    
    return rooms.filter(room => {
        if (filters.building !== 'All' && room.building !== filters.building) return false;
        if (room.capacity < filters.minCapacity) return false;
        const hasAllAmenities = filters.amenities.every(required => room.amenities.includes(required));
        if (!hasAllAmenities) return false;
        if (filters.onlyAvailableNow) {
            const { available } = checkAvailability(room, currentTime, day);
            if (!available) return false;
        }
        return true;
    });
  }, [rooms, filters, currentTime]);

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsAiLoading(true);
    setAiReasoning(null);
    
    const result = await parseNaturalLanguageQuery(searchQuery);
    
    if (result && result.filters) {
        setFilters(prev => ({
            ...prev,
            ...result.filters,
            building: (result.filters.building as Building) || 'All'
        }));
        setAiReasoning(result.reasoning);
    }
    
    setIsAiLoading(false);
  };

  const clearFilters = () => {
      setFilters(INITIAL_FILTERS);
      setSearchQuery('');
      setAiReasoning(null);
  };

  const activeAmenitiesCount = filters.amenities.length;
  const toggleAmenity = (a: Amenity) => {
      setFilters(prev => ({
          ...prev,
          amenities: prev.amenities.includes(a) 
            ? prev.amenities.filter(item => item !== a)
            : [...prev.amenities, a]
      }));
  };

  const toggleSubscription = (cat: EventCategory) => {
      setSubscriptions(prev => 
          prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
      );
  };

  const markNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearNotifications = () => {
      setNotifications([]);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] text-slate-800 font-sans">
      
      {/* Sidebar Navigation & Filters */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={onLogout}>
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">C</div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">CampusSpot</h1>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        List View
                    </button>
                    <button 
                         onClick={() => setViewMode('map')}
                         className={`py-2 text-sm font-medium rounded-md transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Map View
                    </button>
                </div>
                
                <button 
                    onClick={() => setIsSubModalOpen(true)}
                    className="w-full py-2 px-3 border border-slate-200 rounded-lg flex items-center gap-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded">
                        <BellRing size={16} />
                    </div>
                    Manage Alerts
                </button>

                <button 
                    onClick={() => setIsCalcOpen(true)}
                    className="w-full py-2 px-3 border border-slate-200 rounded-lg flex items-center gap-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded">
                        <Calculator size={16} />
                    </div>
                    Attendance Tool
                </button>

                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Filter size={12} /> Filter Options
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Building</label>
                            <select 
                                value={filters.building}
                                onChange={(e) => setFilters({...filters, building: e.target.value as Building | 'All'})}
                                className="w-full text-sm border-slate-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="All">All Buildings</option>
                                {Object.values(Building).map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Min Capacity: {filters.minCapacity}</label>
                            <input 
                                type="range" 
                                min="0" max="200" step="10" 
                                value={filters.minCapacity}
                                onChange={(e) => setFilters({...filters, minCapacity: parseInt(e.target.value)})}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Amenities</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(Amenity).map(amenity => (
                                    <button
                                        key={amenity}
                                        onClick={() => toggleAmenity(amenity)}
                                        className={`px-2 py-1 text-xs rounded-md border transition-colors ${filters.amenities.includes(amenity) ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {amenity}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox"
                                id="availableNow"
                                checked={filters.onlyAvailableNow}
                                onChange={(e) => setFilters({...filters, onlyAvailableNow: e.target.checked})}
                                className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4"
                            />
                            <label htmlFor="availableNow" className="text-sm text-slate-700">Available Now Only</label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 text-slate-500 hover:text-red-600 text-sm font-medium px-2 py-2 rounded-lg hover:bg-red-50 transition-colors mb-2"
                >
                    <LogOut size={16} />
                    Return to Home
                </button>
                <div className="text-center text-xs text-slate-400">
                    <p>Simulated Time: {Math.floor(currentTime/100)}:{(currentTime%100).toString().padStart(2, '0')}</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
            <h1 className="font-bold text-slate-900">CampusSpot</h1>
            <div className="flex items-center gap-4">
                 <NotificationCenter 
                    notifications={notifications}
                    onMarkRead={markNotificationRead}
                    onClearAll={clearNotifications}
                />
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
                    <Menu />
                </button>
            </div>
        </header>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-end items-center px-8 py-4 bg-white border-b border-slate-100">
             <div className="flex items-center gap-4">
                 <div className="text-right">
                     <p className="text-xs font-bold text-slate-700">Welcome, Student</p>
                     <p className="text-[10px] text-slate-400">{subscriptions.length} Active Alerts</p>
                 </div>
                 <NotificationCenter 
                    notifications={notifications}
                    onMarkRead={markNotificationRead}
                    onClearAll={clearNotifications}
                />
             </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {/* AI Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 focus-within:ring-2 focus-within:ring-indigo-100 transition-shadow">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg text-white">
                        <Sparkles size={20} />
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                        placeholder="Ask AI: 'Find a quiet room with a projector for 10 people...'"
                        className="flex-1 outline-none text-slate-700 placeholder-slate-400 text-sm md:text-base"
                    />
                    <button 
                        onClick={handleAiSearch}
                        disabled={isAiLoading}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
                    >
                        {isAiLoading ? 'Thinking...' : 'Search'}
                    </button>
                </div>
                
                {aiReasoning && (
                    <div className="mt-3 p-3 bg-indigo-50 text-indigo-900 text-sm rounded-lg border border-indigo-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                        <Sparkles size={16} className="mt-0.5 shrink-0" />
                        <p>{aiReasoning}</p>
                        <button onClick={() => setAiReasoning(null)} className="ml-auto text-indigo-400 hover:text-indigo-700"><X size={14} /></button>
                    </div>
                )}
            </div>

            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {filters.onlyAvailableNow ? 'Available Rooms' : 'All Rooms'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Found {filteredRooms.length} spaces based on your criteria.
                    </p>
                </div>
                
                {(filters.minCapacity > 0 || filters.building !== 'All' || activeAmenitiesCount > 0) && (
                    <button 
                        onClick={clearFilters}
                        className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors self-start"
                    >
                        <X size={14} /> Clear Filters
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            {viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRooms.length > 0 ? (
                        filteredRooms.map(room => {
                             const { available, nextClass } = checkAvailability(room, currentTime, getCurrentDay());
                             const nextFree = !available ? getNextFreeTime(room, currentTime, getCurrentDay()) : undefined;
                             return (
                                <RoomCard 
                                    key={room.id} 
                                    room={room} 
                                    isAvailable={available}
                                    nextClass={nextClass}
                                    nextFreeTime={nextFree}
                                />
                             );
                        })
                    ) : (
                        <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                            <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                <Search size={20} />
                            </div>
                            <p className="font-medium text-slate-600">No rooms found</p>
                            <p className="text-sm mt-1">Try adjusting your filters or asking the AI differently.</p>
                            <button onClick={clearFilters} className="mt-4 text-indigo-600 text-sm font-medium hover:underline">Reset all filters</button>
                        </div>
                    )}
                </div>
            ) : (
                <MapView 
                    rooms={rooms}
                    selectedBuilding={filters.building}
                    onBuildingSelect={(b) => setFilters({...filters, building: b})}
                    availableRoomIds={new Set(filteredRooms.map(r => r.id))}
                />
            )}
        </div>
      </main>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Subscriptions Modal */}
      <SubscriptionModal 
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        subscriptions={subscriptions}
        onToggle={toggleSubscription}
      />

      {/* Attendance Calculator Modal */}
      <AttendanceCalculator 
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
      />
    </div>
  );
}
