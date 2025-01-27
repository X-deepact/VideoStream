import React, { useEffect, useState } from 'react';
import moment from 'moment';

interface CountdownProps {
  targetDate: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const targetMoment = moment.utc(targetDate);

    const updateCountdown = () => {
      const now = moment.utc();
      const duration = moment.duration(targetMoment.diff(now));

      if (duration.asMilliseconds() <= 0) {
        setTimeLeft('Now');
        return;
      }

      const hours = String(duration.hours()).padStart(2, '0');
      const minutes = String(duration.minutes()).padStart(2, '0');
      const seconds = String(duration.seconds()).padStart(2, '0');

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    const intervalId = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return (
    <div>
      <p className="inline">{timeLeft}</p>
    </div>
  );
};

export default Countdown;
