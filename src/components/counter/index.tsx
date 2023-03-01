/**
 * Special thanks to Yaphi Berhanu and Nilson Jacques
 * for their article on JavaScript based countdown timers
 * https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
 */

import { h } from "preact";
import { useState, useEffect, useMemo } from "preact/hooks";

type Props = {
  targetTime: Date;
  loadNext: () => void;
  autoLoad: boolean;
  currentTime:Date;
};

const getTimeRemaining = (targetTime, currentTime) => {
  const total = Date.parse(targetTime) - Date.parse(new Date(currentTime).toISOString());
  if (total < 0) {
    return {
      total: 0,
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };
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
    return getTimeRemaining(props.targetTime,props.currentTime);
  }, [props.targetTime]);

  const [hours, setHours] = useState<string>(initClock.hours.padStart(2, "0"));
  const [minutes, setMinutes] = useState<string>(
    initClock.minutes.padStart(2, "0")
  );
  const [seconds, setSeconds] = useState<string>(
    initClock.seconds.padStart(2, "0")
  );

  useEffect(() => {
      const t = getTimeRemaining(props.targetTime,props.currentTime);
      setHours(t.hours.padStart(2, "0"));
      setMinutes(t.minutes.padStart(2, "0"));
      setSeconds(t.seconds.padStart(2, "0"));
      if (t.total <= 0) {
        setHours("00");
        setMinutes("00");
        setSeconds("00");
        if (props.autoLoad) {
          props.loadNext();
        }
      }
  }, [props.targetTime,props.autoLoad, props.currentTime]);

  return (
    <div class="oj-typography-heading-2xl oj-sm-align-items-center oj-sm-justify-content-center">
      <div class="oj-sm-justify-content-center orbr-counter-text">
        {hours} : {minutes} : {seconds}
      </div>
      <div class="oj-flex-bar oj-sm-justify-content-center orbr-counter-label">
        <div class="oj-flex-bar-start" style="margin-left: 24px;">HR</div>
        <div class="oj-flex-bar-middle oj-sm-justify-content-center">MIN</div>
        <div class="oj-flex-bar-end" style="margin-right: 24px;">SEC</div>
      </div>
    </div>
  );
}
