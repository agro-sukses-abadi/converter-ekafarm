import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Image, PackageCheck, Zap } from 'lucide-react';
import { Card } from './Card';
import type { ImageItem } from '../types/image';
import { formatBytes, formatPercent, getSavings } from '../utils/format';

const useAnimatedNumber = (target: number) => {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    const start = valueRef.current;
    const difference = target - start;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 650);
      const eased = 1 - (1 - progress) ** 3;
      const nextValue = start + difference * eased;
      valueRef.current = nextValue;
      setValue(nextValue);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
};

export const StatsCard = ({ items }: { items: ImageItem[] }) => {
  const totals = useMemo(() => {
    const original = items.reduce((sum, item) => sum + item.originalSize, 0);
    const converted = items.reduce((sum, item) => sum + (item.convertedSize ?? 0), 0);
    const saved = getSavings(original, converted);
    const reduction = original > 0 && converted > 0 ? (saved / original) * 100 : 0;
    return { original, converted, saved, reduction, images: items.length };
  }, [items]);

  const original = useAnimatedNumber(totals.original);
  const converted = useAnimatedNumber(totals.converted);
  const saved = useAnimatedNumber(totals.saved);
  const reduction = useAnimatedNumber(totals.reduction);
  const images = useAnimatedNumber(totals.images);

  const metrics = [
    { label: 'Original Size', value: formatBytes(original), icon: PackageCheck, tone: 'text-slate-100' },
    { label: 'Converted Size', value: formatBytes(converted), icon: Zap, tone: 'text-brand' },
    { label: 'Saved Bytes', value: formatBytes(saved), icon: Activity, tone: 'text-accent' },
    { label: 'Reduction', value: formatPercent(reduction), icon: Activity, tone: 'text-brand' },
    { label: 'Total Images', value: Math.round(images).toString(), icon: Image, tone: 'text-white' },
  ];

  return (
    <Card title="Statistics" icon={<Activity size={17} className="text-brand" aria-hidden />}>
      <div className="grid gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-2xl border border-line bg-canvas p-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                {metric.label}
                <Icon size={15} aria-hidden />
              </div>
              <p className={`font-mono-stat mt-2 text-2xl font-bold ${metric.tone}`}>{metric.value}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
