"use client";

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: string;
}

const calculateTimeLeft = (endTime: string) => {
  const difference = +new Date(endTime) - +new Date();
  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (!timeLeft) {
    return <span>Lejárt</span>;
  }

  const format = (t: number) => String(t).padStart(2, '0');
  const { days, hours, minutes, seconds } = timeLeft;

  if (days > 0) {
    return <span>{`${days} nap, ${format(hours)}:${format(minutes)}:${format(seconds)}`}</span>;
  }

  return <span>{`${format(hours)}:${format(minutes)}:${format(seconds)}`}</span>;
};

export default CountdownTimer;