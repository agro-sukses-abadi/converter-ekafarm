import { Palette, Settings } from 'lucide-react';
import { Card } from './Card';
import { QualitySlider } from './QualitySlider';
import { ResizePanel } from './ResizePanel';
import type { BackgroundMode, ConverterSettings } from '../types/image';

interface SettingsPanelProps {
  settings: ConverterSettings;
  onChange: (settings: ConverterSettings) => void;
}

const backgrounds: { value: BackgroundMode; label: string; swatch: string }[] = [
  { value: 'transparent', label: 'Transparent', swatch: 'linear-gradient(45deg,#c9d3c7 25%,transparent 25%),linear-gradient(-45deg,#c9d3c7 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#c9d3c7 75%),linear-gradient(-45deg,transparent 75%,#c9d3c7 75%)' },
  { value: 'white', label: 'White', swatch: '#fff' },
  { value: 'black', label: 'Black', swatch: '#000' },
  { value: 'custom', label: 'Custom', swatch: 'var(--color-brand)' },
];

export const SettingsPanel = ({ settings, onChange }: SettingsPanelProps) => (
  <Card title="Settings" icon={<Settings size={17} className="text-brand" aria-hidden />}>
    <div className="space-y-6">
      <QualitySlider value={settings.quality} onChange={(quality) => onChange({ ...settings, quality })} />
      <ResizePanel settings={settings} onChange={onChange} />
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
          <Palette size={16} className="text-brand-hover" aria-hidden />
          Background
        </div>
        <div className="grid grid-cols-2 gap-2">
          {backgrounds.map((background) => (
            <button
              key={background.value}
              type="button"
              className={`focus-ring flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-bold transition ${
                settings.backgroundMode === background.value
                  ? 'border-brand bg-brand/12 text-brand-hover'
                  : 'border-line bg-canvas text-ink-muted hover:text-ink-strong'
              }`}
              onClick={() => onChange({ ...settings, backgroundMode: background.value })}
            >
              <span
                className="h-4 w-4 shrink-0 rounded-full border border-line"
                style={{
                  background: background.value === 'custom' ? settings.customBackground : background.swatch,
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                }}
              />
              {background.label}
            </button>
          ))}
        </div>
        {settings.backgroundMode === 'custom' && (
          <label className="mt-3 flex items-center justify-between gap-3 text-sm font-semibold text-ink-soft">
            Custom color
            <input
              className="h-10 w-16 rounded-xl border border-line bg-canvas p-1"
              type="color"
              value={settings.customBackground}
              onChange={(event) => onChange({ ...settings, customBackground: event.target.value })}
            />
          </label>
        )}
      </div>
    </div>
  </Card>
);
