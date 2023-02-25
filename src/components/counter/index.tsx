import { h } from "preact";
import { useState, useEffect, useMemo } from "preact/hooks";

type Props = {
  targetTime: Date;
};

const getTimeRemaining = (targetTime) => {
  const total = Date.parse(targetTime) - Date.parse(new Date().toISOString());
  if(total < 0){
    return {
      total:0,
      days:"00",
      hours:"00",
      minutes:"00",
      seconds:"00",
    }
  }
  const seconds = Math.floor((total / 1000) % 60).toString();
  const minutes = Math.floor((total / 1000 / 60) % 60).toString();
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24).toString();
  const days = Math.floor(total / (1000 * 60 * 60 * 24)).toString();

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};

export function Counter(props: Props) {
  const initClock = useMemo(() => {
    return getTimeRemaining(props.targetTime);
  }, [props.targetTime]);

  const [hours, setHours] = useState<string>(initClock.hours.padStart(2, "0"));
  const [minutes, setMinutes] = useState<string>(
    initClock.minutes.padStart(2, "0")
  );
  const [seconds, setSeconds] = useState<string>(
    initClock.seconds.padStart(2, "0")
  );

  useEffect(() => {
    const timeinterval = setInterval(() => {
      const t = getTimeRemaining(props.targetTime);
      setHours(t.hours.padStart(2, "0"));
      setMinutes(t.minutes.padStart(2, "0"));
      setSeconds(t.seconds.padStart(2, "0"));
      if (t.total <= 0) {
        clearInterval(timeinterval);
        setHours("00");
        setMinutes("00");
        setSeconds("00");
      }
    }, 1000);
    return () => {
      clearInterval(timeinterval);
    };
  }, [props.targetTime]);

  return (
    <div class="oj-typography-heading-2xl oj-sm-align-items-center oj-sm-justify-content-center">
      <div class="oj-sm-justify-content-center orbr-counter-text">
        {hours} : {minutes} : {seconds}
      </div>
      <div class="oj-sm-justify-content-center oj-typography-heading-xl orbr-counter-label"></div>
    </div>
  );
}
