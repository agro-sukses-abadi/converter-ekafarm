import type { ConverterSettings, ResizeMode } from '../types/image';

interface ResizePanelProps {
  settings: ConverterSettings;
  onChange: (settings: ConverterSettings) => void;
}

const resizeModes: { value: ResizeMode; label: string }[] = [
  { value: 'original', label: 'Original' },
  { value: 'width', label: 'Width' },
  { value: 'height', label: 'Height' },
];

export const ResizePanel = ({ settings, onChange }: ResizePanelProps) => (
  <div className="space-y-4">
    <div>
      <p className="mb-2 text-sm font-semibold text-ink">Resize</p>
      <div className="grid grid-cols-3 gap-2">
        {resizeModes.map((mode) => (
          <button
            key={mode.value}
            type="button"
            className={`focus-ring rounded-xl border px-2 py-2 text-xs font-bold transition ${
              settings.resizeMode === mode.value
                ? 'border-brand bg-brand/12 text-brand-hover'
                : 'border-line bg-canvas text-ink-muted hover:text-ink-strong'
            }`}
            onClick={() => onChange({ ...settings, resizeMode: mode.value })}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <label className="text-sm font-semibold text-ink-soft">
        Width
        <input
          className="focus-ring mt-2 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink-strong"
          type="number"
          min="1"
          value={settings.customWidth}
          disabled={settings.resizeMode !== 'width'}
          onChange={(event) => onChange({ ...settings, customWidth: Number(event.target.value) })}
        />
      </label>
      <label className="text-sm font-semibold text-ink-soft">
        Height
        <input
          className="focus-ring mt-2 w-full rounded-xl border border-line bg-canvas px-3 py-2 text-ink-strong"
          type="number"
          min="1"
          value={settings.customHeight}
          disabled={settings.resizeMode !== 'height'}
          onChange={(event) => onChange({ ...settings, customHeight: Number(event.target.value) })}
        />
      </label>
    </div>

    <label className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-3 py-3 text-sm font-semibold text-ink">
      Maintain aspect ratio
      <input
        className="h-5 w-5 accent-brand"
        type="checkbox"
        checked={settings.maintainAspectRatio}
        onChange={(event) => onChange({ ...settings, maintainAspectRatio: event.target.checked })}
      />
    </label>
  </div>
);
