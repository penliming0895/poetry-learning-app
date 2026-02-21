'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Clock } from 'lucide-react';

interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

export function useStudyReminder() {
  const [settings, setSettings] = useState<ReminderSettings>({
    enabled: false,
    hour: 20,
    minute: 0
  });

  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('studyReminder');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Load notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Check and send reminder
    checkReminder();

    // Check every minute
    const interval = setInterval(checkReminder, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkReminder = () => {
    if (!settings.enabled) return;

    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(settings.hour, settings.minute, 0, 0);

    // Check if it's the reminder time (within the same minute)
    if (
      now.getHours() === reminderTime.getHours() &&
      now.getMinutes() === reminderTime.getMinutes()
    ) {
      sendReminder();
    }
  };

  const sendReminder = () => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const notification = new Notification('📚 学习提醒', {
      body: '该背诵古诗词了！今天还有5首诗词等你挑战哦~',
      icon: '/li_bai.png',
      badge: '/li_bai.png',
      tag: 'study-reminder',
      requireInteraction: false
    });

    notification.onclick = () => {
      window.focus();
      window.location.href = '/daily';
    };
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      alert('您的浏览器不支持通知功能');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const updateSettings = (newSettings: Partial<ReminderSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('studyReminder', JSON.stringify(updated));
  };

  const enableReminder = async (hour: number, minute: number) => {
    const granted = permission === 'granted' || await requestPermission();
    if (granted) {
      updateSettings({ enabled: true, hour, minute });
      return true;
    }
    return false;
  };

  const disableReminder = () => {
    updateSettings({ enabled: false });
  };

  return {
    settings,
    permission,
    enableReminder,
    disableReminder,
    updateSettings
  };
}

export function StudyReminderButton() {
  const { settings, permission, enableReminder, disableReminder } = useStudyReminder();

  const handleToggle = async () => {
    if (settings.enabled) {
      disableReminder();
    } else {
      const granted = await enableReminder(settings.hour, settings.minute);
      if (!granted) {
        alert('请允许浏览器发送通知以使用提醒功能');
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={settings.enabled ? 'default' : 'outline'}
        size="sm"
        onClick={handleToggle}
        className={settings.enabled 
          ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
          : ''
        }
      >
        {settings.enabled ? (
          <>
            <Bell className="h-4 w-4 mr-2" />
            已设置提醒
          </>
        ) : (
          <>
            <BellOff className="h-4 w-4 mr-2" />
            设置学习提醒
          </>
        )}
      </Button>
      {settings.enabled && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>每天 {settings.hour.toString().padStart(2, '0')}:{settings.minute.toString().padStart(2, '0')}</span>
        </div>
      )}
    </div>
  );
}
