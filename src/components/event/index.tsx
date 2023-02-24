import { h } from "preact";

type Props = {
  eventName: string;
}

export function Event(props:Props) {
  return (
    <div class="oj-typography-heading-xl orbr-event-text oj-sm-align-items-center oj-sm-justify-content-center">
      {props.eventName}
    </div>
  );
}
