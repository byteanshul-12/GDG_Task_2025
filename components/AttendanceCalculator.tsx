import React, { useState, useEffect } from 'react';
import { Calculator, AlertTriangle, CheckCircle, X, TrendingUp } from 'lucide-react';

interface AttendanceCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const AttendanceCalculator: React.FC<AttendanceCalculatorProps> = ({ isOpen, onClose }) => {
  const [total, setTotal] = useState<number | ''>('');
  const [attended, setAttended] = useState<number | ''>('');
  const [target, setTarget] = useState(75);
  const [advice, setAdvice] = useState({ type: 'neutral', msg: 'Enter your class details to get insights.' });

  // Logic to calculate status
  useEffect(() => {
    const totalNum = Number(total);
    const attendedNum = Number(attended);

    if (!total || totalNum === 0) {
      setAdvice({ type: 'neutral', msg: 'Enter your class details to get insights.' });
      return;
    }

    if (attendedNum > totalNum) {
      setAdvice({ type: 'error', msg: 'Attended classes cannot be more than total classes.' });
      return;
    }

    const currentPercent = (attendedNum / totalNum) * 100;

    if (currentPercent >= target) {
      // Logic for "Bunk" calculation
      // (attended) / (total + x) >= target / 100
      // x <= (attended / (target/100)) - total
      const maxBunks = Math.floor((attendedNum / (target / 100)) - totalNum);
      
      if (maxBunks > 0) {
        setAdvice({ 
          type: 'good', 
          msg: `Safe Zone! You can bunk the next ${maxBunks} classes and still maintain ${target}%.` 
        });
      } else {
        setAdvice({ 
          type: 'good', 
          msg: `You are on track! But don't miss the next class to stay above ${target}%.` 
        });
      }
    } else {
      // Logic for "Need to Attend" calculation
      // (attended + x) / (total + x) >= target / 100
      // x >= (total * target/100 - attended) / (1 - target/100)
      
      // Avoid division by zero if target is 100
      if (target === 100) {
         setAdvice({ type: 'bad', msg: `Mathematical impossibility: You can never reach 100% if you've missed a class.` });
         return;
      }

      const reqClasses = Math.ceil(((totalNum * target / 100) - attendedNum) / (1 - (target / 100)));
      
      if (reqClasses > 0) {
        setAdvice({ 
          type: 'bad', 
          msg: `Warning! You need to attend ${reqClasses} more classes consecutively to hit ${target}%.` 
        });
      } else {
         // Should be covered by the >= target block, but safe fallback
         setAdvice({ type: 'neutral', msg: 'Calculations updated.' });
      }
    }
  }, [total, attended, target]);

  if (!isOpen) return null;

  const currentVal = (Number(attended) && Number(total)) ? ((Number(attended) / Number(total)) * 100).toFixed(1) : "0.0";
  const currentValNum = parseFloat(currentVal);
  
  // SVG Circle Math
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (currentValNum / 100) * circumference;
  const strokeColor = currentValNum >= target ? 'stroke-emerald-500' : 'stroke-red-500';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Calculator size={24} className="text-indigo-400" />
            </div>
            <div>
                <h2 className="text-xl font-bold">Attendance Calc</h2>
                <p className="text-xs text-slate-400">Plan your bunks smartly</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-slate-800 p-2 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          
          {/* Circular Progress */}
          <div className="flex justify-center relative">
            <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-100"
                    />
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={`${strokeColor} transition-all duration-1000 ease-out`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800">
                    <span className="text-4xl font-extrabold tracking-tighter">{currentVal}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Current</span>
                </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lectures Held</label>
               <input 
                 type="number" 
                 min="1"
                 value={total} 
                 onChange={e => setTotal(e.target.value === '' ? '' : parseInt(e.target.value))} 
                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-center"
                 placeholder="0"
               />
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attended</label>
               <input 
                 type="number" 
                 min="0"
                 value={attended} 
                 onChange={e => setAttended(e.target.value === '' ? '' : parseInt(e.target.value))} 
                 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-center"
                 placeholder="0"
               />
             </div>
          </div>

          {/* Slider */}
          <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <label className="text-sm font-bold text-slate-700">Target Goal</label>
                 <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">{target}%</span>
               </div>
               <input 
                 type="range" 
                 min="60" 
                 max="95" 
                 step="5"
                 value={target} 
                 onChange={e => setTarget(parseInt(e.target.value))} 
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
               />
               <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                   <span>60%</span>
                   <span>75%</span>
                   <span>95%</span>
               </div>
          </div>

          {/* Advice Box */}
          <div className={`p-4 rounded-xl border flex gap-3 transition-colors duration-300 ${
              advice.type === 'good' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 
              advice.type === 'bad' ? 'bg-red-50 border-red-200 text-red-800' : 
              advice.type === 'error' ? 'bg-orange-50 border-orange-200 text-orange-800' :
              'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <div className="mt-0.5 shrink-0">
              {advice.type === 'good' ? <CheckCircle size={18} /> : 
               advice.type === 'bad' ? <AlertTriangle size={18} /> : 
               advice.type === 'error' ? <AlertTriangle size={18} /> :
               <TrendingUp size={18} />}
            </div>
            <p className="text-sm font-medium leading-relaxed">{advice.msg}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AttendanceCalculator;
