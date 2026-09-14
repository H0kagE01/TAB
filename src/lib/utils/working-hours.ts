/**
 * Safe working hours parser and live open/closed status calculator
 * Timezone: Europe/Moscow (Maikop is UTC+3)
 */

export interface StoreStatus {
  isOpen: boolean;
  statusText: string;
  badgeColor: 'emerald' | 'amber' | 'stone';
  todayHoursText: string;
  nextOpenText?: string;
}

/**
 * Calculates whether a store is currently open based on workingHours string
 * Handles formats like:
 * - "08:00 – 21:00"
 * - "Ежедневно: 08:00 – 21:00"
 * - "Пн-Пт: 08:30 – 20:30, Сб-Вс: 10:00 – 18:00"
 */
export function getStoreLiveStatus(workingHoursStr?: string | null): StoreStatus {
  const fallbackHours = workingHoursStr?.trim() || 'Ежедневно: 08:00 – 21:00';

  try {
    // Current time in Moscow / Maikop timezone (UTC+3)
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Europe/Moscow',
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'short',
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
    const minute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
    const weekdayStr = (parts.find((p) => p.type === 'weekday')?.value || '').toLowerCase();

    const currentMinutes = hour * 60 + minute;
    const isWeekend = weekdayStr.startsWith('сб') || weekdayStr.startsWith('вс');

    let openMinutes = 8 * 60; // default 08:00
    let closeMinutes = 21 * 60; // default 21:00
    let displayCloseTime = '21:00';
    let displayOpenTime = '08:00';

    // Parse time range regex: e.g. 08:30 – 20:30 or 08:00 - 21:00
    const timeRangeRegex = /(\d{1,2})[:.](\d{2})\s*[-–—]\s*(\d{1,2})[:.](\d{2})/g;
    const matches = Array.from(fallbackHours.matchAll(timeRangeRegex));

    if (matches.length === 1) {
      // Single schedule for all days
      const m = matches[0];
      const openH = parseInt(m[1], 10);
      const openM = parseInt(m[2], 10);
      const closeH = parseInt(m[3], 10);
      const closeM = parseInt(m[4], 10);

      openMinutes = openH * 60 + openM;
      closeMinutes = closeH * 60 + closeM;
      displayOpenTime = `${String(openH).padStart(2, '0')}:${String(openM).padStart(2, '0')}`;
      displayCloseTime = `${String(closeH).padStart(2, '0')}:${String(closeM).padStart(2, '0')}`;
    } else if (matches.length >= 2) {
      // Weekday / Weekend schedule
      const matchIndex = isWeekend ? 1 : 0;
      const m = matches[matchIndex];
      const openH = parseInt(m[1], 10);
      const openM = parseInt(m[2], 10);
      const closeH = parseInt(m[3], 10);
      const closeM = parseInt(m[4], 10);

      openMinutes = openH * 60 + openM;
      closeMinutes = closeH * 60 + closeM;
      displayOpenTime = `${String(openH).padStart(2, '0')}:${String(openM).padStart(2, '0')}`;
      displayCloseTime = `${String(closeH).padStart(2, '0')}:${String(closeM).padStart(2, '0')}`;
    }

    const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    if (isOpen) {
      return {
        isOpen: true,
        statusText: `Сейчас открыто • до ${displayCloseTime}`,
        badgeColor: 'emerald',
        todayHoursText: `${displayOpenTime} – ${displayCloseTime}`,
      };
    } else {
      return {
        isOpen: false,
        statusText: `Сейчас закрыто • откроется в ${displayOpenTime}`,
        badgeColor: 'stone',
        todayHoursText: `${displayOpenTime} – ${displayCloseTime}`,
        nextOpenText: displayOpenTime,
      };
    }
  } catch (e) {
    console.warn('Error parsing working hours:', e);
    return {
      isOpen: true,
      statusText: 'Ежедневно: 08:00 – 21:00',
      badgeColor: 'emerald',
      todayHoursText: '08:00 – 21:00',
    };
  }
}
