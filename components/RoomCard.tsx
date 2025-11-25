import React from 'react';
import { Room, Amenity } from '../types';
import { Users, Wifi, Monitor, Zap, Mic, VolumeX, MapPin, Clock } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  isAvailable: boolean;
  nextFreeTime?: string;
  nextClass?: string;
}

const AmenityIcon = ({ type }: { type: Amenity }) => {
  switch (type) {
    case Amenity.PROJECTOR: return <Monitor size={14} />;
    case Amenity.AC: return <Zap size={14} />; // Using Zap for power/ac generally
    case Amenity.OUTLETS: return <Zap size={14} />;
    case Amenity.QUIET_ZONE: return <VolumeX size={14} />;
    case Amenity.WHITEBOARD: return <Mic size={14} />; // Abstract rep
    case Amenity.COMPUTERS: return <Wifi size={14} />;
    default: return <div />;
  }
};

const RoomCard: React.FC<RoomCardProps> = ({ room, isAvailable, nextFreeTime, nextClass }) => {
  return (
    <div className={`group relative bg-white rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden ${isAvailable ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-red-500'}`}>
      
      <div className="h-24 overflow-hidden relative">
        <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-semibold shadow-sm flex items-center gap-1">
            <Users size={12} />
            {room.capacity}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight">{room.name}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin size={12} /> {room.building}, Floor {room.floor}
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${isAvailable ? 'text-emerald-700' : 'text-red-700'}`}>
                {isAvailable ? 'Available Now' : 'Occupied'}
            </span>
        </div>
        
        {/* Availability Info */}
        <div className="bg-slate-50 rounded-lg p-2 mb-3 text-xs text-slate-600">
             {!isAvailable && nextClass && (
                 <div className="flex items-center gap-2">
                     <Clock size={12} />
                     <span>Busy with: <strong>{nextClass}</strong></span>
                 </div>
             )}
             {!isAvailable && nextFreeTime && (
                 <div className="text-emerald-600 font-medium mt-1">
                     Free at {nextFreeTime}
                 </div>
             )}
             {isAvailable && (
                 <span className="text-slate-500">Free until next scheduled class</span>
             )}
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {room.amenities.map(a => (
            <span key={a} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider font-bold rounded-full">
               <AmenityIcon type={a} /> {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
