import { Counter } from "../counter/index";
import { Time } from "../time/index";
import { h } from "preact";
import { useState, useCallback, useRef } from "preact/hooks";
import MutableArrayDataProvider = require("ojs/ojmutablearraydataprovider");
import "ojs/ojdrawerpopup";
import "ojs/ojbutton";
import "ojs/ojswitch";
import "ojs/ojformlayout";
import "ojs/ojinputtext";
import "ojs/ojlistview";
import { ojListView } from "ojs/ojlistview";
import { ojSwitch } from "ojs/ojswitch";
import { ojInputText, ojTextArea } from "ojs/ojinputtext";
import { ojButton } from "ojs/ojbutton";

type Event = {
  name: string;
  startTime: string;
};

let eventData = [];

export function Content() {
  const eventDP = useRef(
    new MutableArrayDataProvider<Event["name"], Event>(eventData, {
      keyAttributes: "name",
    })
  );

  const [eventTime, setEventTime] = useState<Date>(
    new Date("2022-12-25 00:00:00")
  );
  const [name, setName] = useState<string>("No Event");
  const [endOpened, setEndOpened] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [locale, setLocale] = useState<boolean>(false);
  const [eventNameVal, setEventNameVal] = useState<string>("");
  const [startTimeVal, setStartTimeVal] = useState<string>("");
  const [scheduleValue,setScheduleValue] = useState<string>("");

  const updateScheduleVal = (event:ojTextArea.valueChanged) => {
    setScheduleValue(event.detail.value);
  }

  const importSchedule = () => {
    let newSchedule = JSON.parse(scheduleValue);
    eventDP.current.data = newSchedule;
  }

  const updateNameVal = (event: ojInputText.valueChanged) => {
    setEventNameVal(event.detail.value);
  };
  const updateStartTimeVal = (event: ojInputText.valueChanged) => {
    setStartTimeVal(event.detail.value);
  };
  const addEvent = () => {
    let tempName = eventNameVal;
    let tempStart = startTimeVal;
    let tempArray = [...eventDP.current.data];
    let startParts = tempStart.split(" ");
    let finalStart = startParts.toString().replace(",", "T");
    console.log("name: " + tempName + " : " + finalStart);

    tempArray.push({ name: tempName, startTime: finalStart });
    eventDP.current.data = tempArray;
  };
  
  //TODO
  const [timeNow, setTimeNow] = useState<Date>(new Date(Date.now()));
  const endToggle = () => {
    endOpened ? setEndOpened(false) : setEndOpened(true);
  };
  const open = () => {
    setEndOpened(true);
  };

  const formatDate = (data) => {
    let dateObj = new Date(data);
    let options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    return dateObj.toLocaleString(
      locale ? navigator.language : "en-US",
      options
    );
  };

  const updateLocale = (event: ojSwitch.valueChanged) => {
    setLocale(event.detail.value);
  };
  const handleSelection = useCallback(
    (event: ojListView.firstSelectedItemChanged<Event["name"], Event>) => {
      console.log(event.detail.value);
      if (event.detail.updatedFrom === "internal" && event.detail.value.data) {
        setName(event.detail.value.data.name);
        setEventTime(new Date(event.detail.value.data.startTime));
      }else{
        setName("No Event");
        setEventTime(new Date("2022-12-25 00:00:00"));
      }
    },
    [eventTime, name]
  );

  const deleteEvent = (event) => {
    let removedEvent = event.target.id;
    let tempArray = [];
    eventDP.current.data.filter((event) => {
      if (event.name !== removedEvent) {
        tempArray.push({ name: event.name, startTime: event.startTime });
      }
    });
    if(tempArray.length === 0) {
      setName('No Event');
      setEventTime(new Date("2022-12-25 00:00:00"));
      setSelectedEvent(null);
    }
    eventDP.current.data = tempArray;
  };

  const listItemTemplate = (
    event: ojListView.ItemTemplateContext<Event["name"], Event>
  ) => {
    return (
      <div>
        <oj-label-value>
          <div slot={"label"}>{event.data.name}</div>
          <div slot={"value"}>{formatDate(event.data.startTime)}</div>
        </oj-label-value>
        <oj-button
          id={event.data.name}
          onojAction={deleteEvent}
          label="Remove"
        ></oj-button>
      </div>
    );
  };
  const noDataTemplate = (
    event: ojListView.ItemTemplateContext<Event["name"], Event>
  ) => {
    return (
      <div>
        <h3>No Events available</h3>
        <div>Add an individual event, or import a full schedule below.</div>
      </div>
    );
  };

  return (
    <>
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
            <Time localTime={timeNow}/>
        </div>
          <div class="oj-flex-item oj-sm-flex-items-initial oj-sm-align-items-center oj-typography-heading-md orbr-event-container">
            <div>Countdown to {name} : </div>
            <Counter targetTime={eventTime} />
          </div>
          {/* <div class="oj-flex-item oj-sm-flex-items-initial oj-sm-align-items-center">
            <Counter targetTime={eventTime} />
          </div> */}
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
            <div class="orbr-drawer-container">
              <div class="oj-flex-bar orbr-drawer-header">
                <h6 class="oj-flex-bar-start">Event Settings</h6>
                <oj-button
                  id="endButtonCloser"
                  display="icons"
                  chroming="borderless"
                  class="oj-flex-bar-end"
                  onojAction={endToggle}
                >
                  <span
                    slot="startIcon"
                    class="oj-ux-ico-close orbr-drawer-text-color"
                  ></span>
                  Close
                </oj-button>
              </div>
              <div class="orbr-drawer-content">
                <oj-form-layout>
                  <oj-switch
                    labelHint="Use browser locale"
                    labelEdge="inside"
                    value={locale}
                    onvalueChanged={updateLocale}
                  ></oj-switch>
                </oj-form-layout>
                <h4>Select active event</h4>
                <oj-list-view
                  data={eventDP.current}
                  selectionMode="single"
                  selected={selectedEvent}
                  onfirstSelectedItemChanged={handleSelection}
                  class="orbr-listview-sizing"
                >
                  <template
                    slot="itemTemplate"
                    render={listItemTemplate}
                  ></template>
                  <template
                    slot="noData"
                    render={noDataTemplate}
                  ></template>
                </oj-list-view>

                <oj-form-layout class="oj-sm-margin-4x-top">
                  <h4>Add new event</h4>
                  <oj-input-text
                    labelHint="Name"
                    value={eventNameVal}
                    onvalueChanged={updateNameVal}
                  ></oj-input-text>
                  <oj-input-text
                    labelHint="Start time"
                    placeholder="YYYY-MM-DD HH:MM:SS"
                    help={{
                      instruction:
                        "Required format YYYY-MM-DD<space>HH:MM:SS with one space.",
                    }}
                    value={startTimeVal}
                    onvalueChanged={updateStartTimeVal}
                  ></oj-input-text>
                  <oj-button
                    onojAction={addEvent}
                    label="Add event"
                  ></oj-button>
                </oj-form-layout>
                <oj-form-layout class="oj-sm-margin-4x-top">
                  <h4>Import event schedule</h4>
                  <oj-text-area
                  rows={10}
                  labelHint="Schedule"
                  placeholder='[ {"name": "My event", "startTime":"2023-03-19 14:15:00"} ]'
                  value={scheduleValue}
                  help={{instruction:'paste array of objects in the format of \{"name":"my event", "startTime":"YYYY-MM-DD<space>HH:MM:SS"\}'}}
                  onvalueChanged={updateScheduleVal}
                  ></oj-text-area>
                  <oj-button onojAction={importSchedule} label="Import"></oj-button>
                </oj-form-layout>
              </div>
            </div>
          </oj-drawer-popup>
        </span>
      </div>
      <button class="addbtn" onClick={open}>
        <div class="orbr-settings-ico oj-ux-ico-settings"></div>
      </button>
    </>
  );
}
