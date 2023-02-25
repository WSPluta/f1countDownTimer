import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

type Props = {
  localTime: Date
};

export function Time(props: Props) {
  const [time, setTime] = useState<number>(Date.now());

  const formatDate = (data,timezone) => {
    let dateObj = new Date(data);
    let options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second:"2-digit",
      timeZone: timezone, // "Europe/Prague"
      hour12: false,
    };

    return dateObj.toLocaleTimeString(navigator.language,
      options
    );
  };

  useEffect(() => {
		let timer = setInterval(() => setTime(Date.now()), 1000);
		return () => clearInterval(timer);
	}, []);

  return (
    <div class="oj-typography-heading-2xl oj-sm-align-items-center oj-sm-justify-content-center">
      <div class="oj-sm-justify-content-center orbr-counter-text">
      <div>Current time: {formatDate(time,Intl.DateTimeFormat().resolvedOptions().timeZone)}</div>
      <div>Factory time: {formatDate(time,'Europe/Prague')}</div>
      </div>
      <div class="oj-sm-justify-content-center oj-typography-heading-xl orbr-counter-label"></div>
    </div>
  );
}
