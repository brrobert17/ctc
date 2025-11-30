export function CarSpecsGrid() {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-4 bg-slate-800/50 border-b border-slate-800">
        <h3 className="font-bold text-white">Car Details</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-800">
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Make</span>
          <span className="text-slate-200 font-medium">Volkswagen</span>
        </div>
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Model</span>
          <span className="text-slate-200 font-medium">Golf</span>
        </div>
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Year</span>
          <span className="text-slate-200 font-medium">2019</span>
        </div>
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Mileage</span>
          <span className="text-slate-200 font-medium">65,000 km</span>
        </div>
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Transmission</span>
          <span className="text-slate-200 font-medium">Manual</span>
        </div>
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Fuel Type</span>
          <span className="text-slate-200 font-medium">Petrol</span>
        </div>
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Engine</span>
          <span className="text-slate-200 font-medium">1.5 L (150 HP)</span>
        </div>
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Body Type</span>
          <span className="text-slate-200 font-medium">Hatchback</span>
        </div>
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Doors</span>
          <span className="text-slate-200 font-medium">5</span>
        </div>
        <div className="bg-slate-900 p-4 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Color</span>
          <span className="text-slate-200 font-medium">Deep Black Pearl</span>
        </div>
      </div>
    </div>
  )
}
