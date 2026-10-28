import { env } from '../config/env.js';

function isWithinNapTime(): boolean {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const utcMinute = now.getUTCMinutes();
  const currentMinutes = utcHour * 60 + utcMinute;

  const [startHour, startMin] = env.KEEP_ALIVE_START_NAP_UTC.split(':').map(Number);
  const [endHour, endMin] = env.KEEP_ALIVE_END_NAP_UTC.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // Handle nap window (e.g., 01:00 to 07:00)
  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    // Nap crosses midnight
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
}

export const startKeepAlive = (baseUrl?: string) => {
  if (!env.KEEP_ALIVE_ENABLED) {
    console.log('Keep-alive disabled');
    return;
  }

  const url = baseUrl || `http://localhost:${env.PORT}/api/health`;
  const intervalMs = env.KEEP_ALIVE_INTERVAL_MINUTES * 60 * 1000;

  console.log(`Keep-alive started: pinging ${url} every ${env.KEEP_ALIVE_INTERVAL_MINUTES} min (nap: ${env.KEEP_ALIVE_START_NAP_UTC}-${env.KEEP_ALIVE_END_NAP_UTC} UTC)`);

  const interval = setInterval(async () => {
    try {
      if (isWithinNapTime()) {
        console.log('Keep-alive: skipping during nap window');
        return;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'User-Agent': 'RADCO-KeepAlive' },
      });
      
      if (response.ok) {
        console.log('Keep-alive: ping successful');
      } else {
        console.log(`Keep-alive: ping failed with status ${response.status}`);
      }
    } catch (error) {
      // Resilient to network errors - never crash
      console.log('Keep-alive: ping error (ignored)');
    }
  }, intervalMs);

  return () => clearInterval(interval);
};
