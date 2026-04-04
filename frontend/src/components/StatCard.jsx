const StatCard = ({ label, value, icon: Icon, color }) => {
  if (!Icon) return null;

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-soft hover:shadow-xl transition-all group flex flex-col justify-between border border-slate-50 min-h-[160px]">
      <div className="flex justify-between items-start">
        <h4 className="text-[10px] font-black text-slate-400 tracking-[0.1em] uppercase leading-none">
          {label}
        </h4>
        <div className={`p-4 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform ${color || 'text-slate-800'}`}>
          <Icon className="w-6 h-6 stroke-[2.5]" />
        </div>
      </div>
      <div>
        <p className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none pt-2">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
