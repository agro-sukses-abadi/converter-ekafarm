import { useCallback, useState } from 'react';
import type { ToastMessage, ToastTone } from '../types/toast';

export const useToasts = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback((tone: ToastTone, title: string, message?: string) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, tone, title, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4_000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return { toasts, pushToast, dismissToast };
};
