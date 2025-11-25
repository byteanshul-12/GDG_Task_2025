import React from 'react';
import { X, BellRing } from 'lucide-react';
import { EventCategory } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: EventCategory[];
  onToggle: (cat: EventCategory) => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, subscriptions, onToggle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <BellRing size={20} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
                <p className="text-xs text-slate-500">Choose what you want to hear about</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {Object.values(EventCategory).map((category) => {
            const isSubscribed = subscriptions.includes(category);
            return (
              <label 
                key={category}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isSubscribed ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                   <span className={`font-medium ${isSubscribed ? 'text-indigo-900' : 'text-slate-600'}`}>{category}</span>
                </div>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={isSubscribed}
                    onChange={() => onToggle(category)}
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${isSubscribed ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isSubscribed ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="p-6 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow"
            >
                Save Preferences
            </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;