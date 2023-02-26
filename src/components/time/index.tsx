import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

type Props = {
  localTime: Date;
};

export function Time(props: Props) {
  const [time, setTime] = useState<number>(Date.now());

  const formatDate = (data, timezone) => {
    let dateObj = new Date(data);
    let options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: timezone, // "Europe/Prague"
      hour12: false,
    };

    return dateObj.toLocaleTimeString(navigator.language, options);
  };

  useEffect(() => {
    let timer = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div class="oj-flex oj-sm-flex-direction-column oj-typography-subheading-xl oj-sm-align-items-start orbr-time-text">
      <div class="oj-flex-item">
        TIME AT CIRCUIT:{" "}
        {formatDate(time, Intl.DateTimeFormat().resolvedOptions().timeZone)}
      </div>
      <div class="oj-flex-item">TIME AT FACTORY: {formatDate(time, "Europe/Prague")}</div>
    </div>
  );
}
