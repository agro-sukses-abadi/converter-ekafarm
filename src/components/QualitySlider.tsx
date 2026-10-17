export const QualitySlider = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => (
  <div>
    <div className="mb-2 flex items-center justify-between">
      <label htmlFor="quality" className="text-sm font-semibold text-slate-200">
        WebP Quality
      </label>
      <span className="font-mono-stat rounded-lg bg-canvas px-2 py-1 text-sm text-brand">{value}</span>
    </div>
    <input
      id="quality"
      className="slider h-2 w-full"
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
    <div className="mt-2 flex justify-between text-xs text-slate-500">
      <span>Smaller</span>
      <span>Sharper</span>
    </div>
  </div>
);
