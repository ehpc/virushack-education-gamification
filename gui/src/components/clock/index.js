import React, { useState, useEffect } from 'react';
import differenceInSeconds from 'date-fns/differenceInSeconds';

import ClockIcon from '../clock-icon';

/**
 * Форматирует часы конференции
 * @param {number} seconds Сколько секунд прошло
 */
function formatDuration(seconds) {
  const minutes = String(Math.trunc(seconds / 60));
  const remainder = String(seconds % 60);
  return `${minutes.padStart(2, '0')}:${remainder.padStart(2, '0')}`;
}

export default function () {
  // Часы конференции
  const [startDate] = useState(new Date());
  const [duration, setDuration] = useState(0);

  // Обновление времени конференции
  useEffect(() => {
    const timer = setTimeout(() => {
      setDuration(differenceInSeconds(new Date(), startDate));
    }, 1000);
    return () => clearTimeout(timer);
  }, [startDate, duration]);

  return <ClockIcon size="md" text={formatDuration(duration)} />;
}
