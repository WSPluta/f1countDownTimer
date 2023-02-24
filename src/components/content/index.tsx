import { Event } from "../event/index";
import { Counter } from "../counter/index";
import { h } from "preact";
import { useState } from "preact/hooks";
import "ojs/ojdrawerpopup";
import "ojs/ojbutton";
import "ojs/ojformlayout";
import "ojs/ojinputtext";

export function Content() {
  const [eventTime, setEventTime] = useState<Date>(
    new Date("02/24/2023 19:50:59")
  );
  const [name, setName] = useState<string>("Event Name");
  const [endOpened, setEndOpened] = useState<boolean>(false);

  const endToggle = () => {
    endOpened ? setEndOpened(false) : setEndOpened(true);
  };

  const open = () => {
    setEndOpened(true);
  };

  return (
    // outer container
    <div class="oj-flex oj-sm-flex-direction-row oj-sm-12 orbr-content-container">
      {/* 3 column panel for times and event data */}
      <div class="oj-flex-item oj-flex oj-sm-flex-direction-column oj-sm-4 orbr-event-panel">
        <div class="oj-flex-item oj-sm-align-items-center">
          <div
            role="img"
            class="oj-flex oj-flex-item oj-icon orbr-oracle-icon oj-sm-align-items-centre"
            title="red bull racing oracle partner logo"
            alt="Red Bull Racing Oracle Partner"
          ></div>
        </div>      
        <div class="oj-flex-item oj-sm-flex-items-initial oj-sm-align-items-center orbr-clock-container">
          Time stuff goes here
        </div>
        <div class="oj-flex-item oj-sm-flex-items-initial oj-sm-align-items-center orbr-event-container">
          <Event eventName={name} />
        </div>
        <div class="oj-flex-item oj-sm-flex-items-initial oj-sm-align-items-centre orbr-counter-container">
          <Counter targetTime={eventTime} />
        </div>
      </div>

      {/* 9 column panel for video or other content */}
      <div class="oj-flex-item oj-sm-8">
        <div class="orbr-video-container">video goes there</div>
      </div>

      {/* event configuration drawer */}
      <span>
          <oj-drawer-popup
            class="orbr-drawer-end"
            edge="end"
            opened={endOpened}
            autoDismiss="none"
          >
            <div class="orbr-drawer-header">
              <h6 class="orbr-drawer-text-color">Address</h6>
              <oj-button
                id="endButtonCloser"
                display="icons"
                chroming="borderless"
                class="orbr-drawer-text-color"
                onojAction={endToggle}
              >
                <span
                  slot="startIcon"
                  class="oj-ux-ico-close orbr-drawer-text-color"
                ></span>
                Close
              </oj-button>
            </div>
            <div class="demo-padding demo-form-container">
              <oj-form-layout>
                <oj-input-text
                  aria-label="line1"
                  value="Line 1"
                  class="orbr-drawer-text-color"
                ></oj-input-text>
                <oj-input-text
                  aria-label="line2"
                  value="Line 2"
                  class="orbr-drawer-text-color"
                ></oj-input-text>
              </oj-form-layout>
            </div>
          </oj-drawer-popup>
        </span>
        <oj-button onojAction={open} label="Edit Events" class="oj-color-invert"></oj-button>
    </div>
  );
}
