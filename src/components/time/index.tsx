import { h } from "preact";
import { useEffect } from "preact/hooks";

type Props = {
  localTime: Date;
  onUpdate: (time) => void;
};

export function Time(props: Props) {

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

  /** One timer with one setInterval controls the current time for the clock and countdown.
   * This keeps the two timed events synchronized
   */
  useEffect(() => {
    let timer = setInterval(() => props.onUpdate(Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div class="oj-flex oj-sm-flex-direction-column oj-typography-subheading-xl oj-sm-align-items-start orbr-time-text">
      <div class="oj-flex">
        <div
          role="img"
          class="oj-flex oj-flex-item oj-icon oj-sm-align-items-centre orbr-line-icon"
          title="line"
          alt="lineBreak"></div>
      </div>
      <div class="oj-flex-item">
        <span class="orbr-time-text-label2"> LOCAL TIME: </span>
      </div>
      <div class="oj-flex-item">
        <span class="orbr-time-text-clock">
          {formatDate(props.localTime, Intl.DateTimeFormat().resolvedOptions().timeZone)}{" "}
        </span>
      </div>
    </div>
  );
}
