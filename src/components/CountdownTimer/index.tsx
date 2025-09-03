import { AlarmClock } from "lucide-react";
import { useEffect, useState } from "react";

const CountdownTimer = ({ expiryTime }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(expiryTime) - new Date();
    if (difference > 0) {
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return { hours, minutes, seconds };
    }
    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime]);

  return (
    <div className="hidden sm:flex sm:w-full bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md border-b border-white/10 sm:rounded-[15px]  p-4 px-6 space-x-4 sm:items-center sm:text-center ">
      <AlarmClock size={24} color="#cca300"/>
      <div className="w-full flex justify-between">
        <h5 className="text-sm sm:text-base font-medium text-white">Waktu Tersisa:</h5>
        <h5 className="text-sm sm:text-base font-semibold text-orange-400">
          {timeLeft.hours.toString().padStart(2, "0")}:
          {timeLeft.minutes.toString().padStart(2, "0")}:
          {timeLeft.seconds.toString().padStart(2, "0")}
        </h5>
      </div>
    </div>
  );
};

export default CountdownTimer