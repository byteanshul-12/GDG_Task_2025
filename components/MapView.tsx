import React from 'react';
import { Room, Building } from '../types';

interface MapViewProps {
  rooms: Room[];
  selectedBuilding: Building | 'All';
  onBuildingSelect: (b: Building) => void;
  availableRoomIds: Set<string>;
}

const MapView: React.FC<MapViewProps> = ({ rooms, selectedBuilding, onBuildingSelect, availableRoomIds }) => {
  
  // Filter rooms for map
  const displayRooms = selectedBuilding === 'All' 
    ? rooms.filter(r => r.building === Building.ENGINEERING) // Default view
    : rooms.filter(r => r.building === selectedBuilding);

  const currentBuildingName = selectedBuilding === 'All' ? Building.ENGINEERING : selectedBuilding;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Campus Map View
                <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Beta</span>
            </h2>
            <select 
                value={selectedBuilding === 'All' ? Building.ENGINEERING : selectedBuilding}
                onChange={(e) => onBuildingSelect(e.target.value as Building)}
                className="text-sm border border-slate-300 rounded-md px-2 py-1 bg-slate-50"
            >
                {Object.values(Building).map(b => (
                    <option key={b} value={b}>{b}</option>
                ))}
            </select>
        </div>

        {/* CSS Grid Map Simulation */}
        <div className="relative w-full aspect-[16/9] bg-slate-100 rounded-lg border-2 border-slate-300 p-8 overflow-hidden">
            <div className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                {currentBuildingName} - Floor Plan
            </div>
            
            <div className="grid grid-cols-4 grid-rows-3 gap-4 h-full">
                {displayRooms.map((room, index) => {
                    const isAvail = availableRoomIds.has(room.id);
                    // Mock positioning logic based on index
                    return (
                        <div 
                            key={room.id}
                            className={`
                                relative rounded-lg border-2 flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer hover:scale-105
                                ${isAvail 
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 hover:bg-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                                    : 'bg-white border-slate-300 text-slate-400 opacity-60 grayscale'}
                            `}
                            style={{ 
                                gridColumn: index % 2 === 0 ? 'span 2' : 'span 1',
                                gridRow: 'span 1'
                            }}
                        >
                            <span className="font-bold text-sm">{room.name.split(' ')[0]}</span>
                            <span className="text-[10px] mt-1">{room.capacity} Seats</span>
                            {isAvail && <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>}
                        </div>
                    );
                })}
                
                {/* Filler/Corridor blocks for visual effect */}
                <div className="row-span-3 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs font-mono writing-vertical">
                    CORRIDOR A
                </div>
            </div>
        </div>
        
        <div className="mt-4 flex gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-50 border border-emerald-400 rounded"></div> Available
            </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white border border-slate-300 rounded opacity-60"></div> Occupied
            </div>
        </div>
    </div>
  );
};

export default MapView;
