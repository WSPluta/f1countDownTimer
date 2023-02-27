import { Counter } from "../counter/index";
import { Time } from "../time/index";
import { h } from "preact";
import { useState, useCallback, useRef, useEffect } from "preact/hooks";
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
import { KeySet, KeySetImpl } from "ojs/ojkeyset";
import { FetchByKeysParameters } from "@oracle/oraclejet/ojdataprovider";

type Event = {
  name: string;
  startTime: string;
};

let eventData = [];
if(localStorage.length > 0){
  for (let event in localStorage) {
    let val = localStorage.getItem(event);
    if(typeof(val) === 'string')
    eventData.push(
       {name:event, startTime:val}
     )
  }
}

export function Content() {
  const eventDP = useRef(
    new MutableArrayDataProvider<Event["name"], Event>(eventData)
  );

  const [eventTime, setEventTime] = useState<Date>(
    new Date("2022-12-25 00:00:00")
  );
  const [name, setName] = useState<string>("No Event");
  const [endOpened, setEndOpened] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [locale, setLocale] = useState<boolean>(false);
  const [autoLoad, setAutoLoad] = useState<boolean>(false);
  const [eventNameVal, setEventNameVal] = useState<string>("");
  const [startTimeVal, setStartTimeVal] = useState<string>("");
  const [scheduleValue, setScheduleValue] = useState<string>("");

  const updateScheduleVal = (event: ojTextArea.valueChanged) => {
    setScheduleValue(event.detail.value);
  };

  const updateAutoLoad = (event: ojSwitch.valueChanged) => {
    setAutoLoad(event.detail.value);
  };
  const loadNextScheduleItem = () => {
    let currentKey: Array<any> = Array.from(selectedEvent.keys.keys.values());
    let newKey = currentKey[0] + 1;
    if (newKey < eventDP.current.data.length){
    setSelectedEvent(new KeySetImpl([newKey]));
    }else {
      setAutoLoad(false);
      setSelectedEvent(new KeySetImpl([]));
    }
  };
  const importSchedule = () => {
    let newSchedule = JSON.parse(scheduleValue);
    for(let event in newSchedule){      
      localStorage.setItem(newSchedule[event].name,newSchedule[event].startTime)
    }
    eventDP.current.data = newSchedule;
  };

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
    let exists = tempArray.find(event=>event.name === eventNameVal)
    if(!exists){
    let startParts = tempStart.split(" ");
    let finalStart = startParts.toString().replace(",", "T");
    console.log("name: " + tempName + " : " + finalStart);

    tempArray.push({ name: tempName, startTime: finalStart });
    localStorage.setItem(tempName, finalStart)
    eventDP.current.data = tempArray;
    }else{
      alert('name already exists, please use a different event name.')
    }
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

  const selectedChangedHandler = useCallback(
    (event: ojListView.selectedChanged<Event["name"], Event>) => {
      console.log("Selected: ", event.detail.value);
      if (event.detail.updatedFrom === "internal") {
         setSelectedEvent(event.detail.value);
      }
    },
    [selectedEvent]
  );

  useEffect(() => {
    if (selectedEvent) {
      let key: Array<string> = Array.from(
        (selectedEvent as KeySetImpl<Event["name"]>).keys.keys.values()
      );
      let tempData = [...eventDP.current.data];
      if (key.length > 0) {
        let data = tempData[key[0]];
        setName(data.name);
        setEventTime(new Date(data.startTime));
      } else {
        //setSelectedEvent(new KeySetImpl([]));
        setName("No Event");
        setEventTime(new Date("2022-12-25 00:00:00"));
      }
    }
  }, [selectedEvent]);

  const deleteEvent = (event) => {
    let removedEvent = event.target.id;
    let tempArray = [];
    eventDP.current.data.filter((event) => {
      if (event.name !== removedEvent) {
        tempArray.push({ name: event.name, startTime: event.startTime });
      }
    });
    if (tempArray.length === 0) {
      setName("No Event");
      setEventTime(new Date("2022-12-25 00:00:00"));
      setSelectedEvent(null);
    }
    eventDP.current.data = tempArray;
    localStorage.removeItem(removedEvent);
  };

  const listItemTemplate = (
    event: ojListView.ItemTemplateContext<Event["name"], Event>
  ) => {
    return (
      <div class="oj-flex-bar">
        <div class="oj-flex-bar-start oj-flex oj-sm-flex-direction-column">
          <div class="oj-flex-item oj-typography-subheading-sm ">
            {event.data.name}
          </div>
          <div class="oj-flex-item">{formatDate(event.data.startTime)}</div>
        </div>
        <oj-button
          display="icons"
          id={event.data.name}
          onojAction={deleteEvent}
          label="Remove"
          class="oj-flex-bar-end"
          data-oj-clickthrough="disabled"
        >
          <span slot="startIcon" class="oj-ux-ico-close"></span>
        </oj-button>
      </div>
    );
  };
  const noDataTemplate = () => {
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
        {/* 4 column panel for times and event data */}
        <div class="oj-flex-item oj-flex oj-sm-flex-direction-column oj-sm-3 oj-sm-margin-2x-left orbr-event-panel">
          <div class="oj-flex-item oj-sm-align-items-center">
            <div
              role="img"
              class="oj-flex oj-flex-item oj-icon orbr-tag-icon oj-sm-align-items-centre"
              title="Tag Heuer logo"
              alt="Tag Heuer logo"
            ></div>
          </div>
          <div class="oj-flex-item oj-sm-flex-items-initial oj-sm-align-items-center oj-typography-heading-md orbr-event-container">
            <div class="oj-flex-item oj-sm-flex-items-initial oj-sm-align-items-center orbr-time-text-label">
              COUNTDOWN TO:
              </div>
            <div class="oj-flex-item oj-sm-flex-items-initial oj-sm-align-items-center orbr-time-text-hero-label">
              {name}
            </div>
            <Counter
              targetTime={eventTime}
              autoLoad={autoLoad}
              loadNext={loadNextScheduleItem}/>
            <div class="oj-flex-item oj-sm-flex-items-initial oj-sm-align-items-center orbr-time-text-hero-label">
            {/* <div
              role="img"
              class="oj-flex oj-flex-item oj-icon oj-sm-align-items-centre orbr-line-icon"
              title="line"
              alt="lineBreak"
            ></div> */}
            <Time localTime={timeNow} />
          </div>
          </div>
          {/* <div class="oj-flex-item oj-sm-flex-items-initial oj-sm-align-items-center orbr-clock-container">
            <Time localTime={timeNow} />
          </div> */}
          {/* <div class="oj-flex-item oj-sm-flex-items-initial oj-sm-align-items-center oj-typography-heading-md orbr-event-container">
            <div>
              COUNTDOWN TO <i>{name} :</i>
            </div>
            <Counter
              targetTime={eventTime}
              autoLoad={autoLoad}
              loadNext={loadNextScheduleItem}
            />
          </div> */}
          {/* <div class="oj-flex-item oj-sm-flex-items-initial oj-sm-align-items-center">
            <Counter targetTime={eventTime} />
          </div> */}
          
        </div>

        {/* 8 column panel for video or other content */}
        <div class="oj-flex-item oj-sm-9">
          {/* Add content for the right side panel inside of the below <div> */}
          <div class="oj-flex orbr-video-container">          
          </div>
          <div class="oj-flex-item oj-typography-subheading-md oj-flex-bar oj-color-invert">
          <div class="oj-flex-bar-end">
            <span class="o-text" >POWERED BY</span>
            <button class="addbtn2" onClick={open}>
            <div
              role="img"
              class="oj-icon orbr-oracle-icon"
              title="oracle logo"
              alt="Oracle logo"
            ></div>
            </button>
          </div>
        </div>
        </div>
        {/* <div class="oj-flex-item oj-typography-subheading-md oj-flex-bar oj-color-invert oj-sm-margin-2x-top">
          <div class="oj-flex-bar-end">
            POWERED BY
            <div
              role="img"
              class="oj-icon orbr-oracle-icon"
              title="oracle logo"
              alt="Oracle logo"
            ></div>
          </div>
        </div> */}

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
                  <oj-switch
                    labelHint="Auto-load schedule"
                    labelEdge="inside"
                    value={autoLoad}
                    onvalueChanged={updateAutoLoad}
                  ></oj-switch>
                </oj-form-layout>
                <h4>Select active event</h4>
                <oj-list-view
                  data={eventDP.current}
                  selectionMode="single"
                  gridlines={{ item: "visibleExceptLast" }}
                  selected={selectedEvent}
                  onselectedChanged={selectedChangedHandler}
                  class="orbr-listview-sizing"
                >
                  <template
                    slot="itemTemplate"
                    render={listItemTemplate}
                  ></template>
                  <template slot="noData" render={noDataTemplate}></template>
                </oj-list-view>

                <oj-form-layout class="oj-sm-margin-4x-top">
                  <h4>Add new event</h4>
                  <oj-input-text
                    labelHint="Name"
                    value={eventNameVal}
                    clearIcon="conditional"
                    help={{ instruction: "All event names must be unique" }}
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
                    clearIcon="conditional"
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
                    help={{
                      instruction:
                        'paste array of objects in the format of {"name":"my event", "startTime":"YYYY-MM-DD<space>HH:MM:SS"}',
                    }}
                    onvalueChanged={updateScheduleVal}
                  ></oj-text-area>
                  <oj-button
                    onojAction={importSchedule}
                    label="Import"
                  ></oj-button>
                </oj-form-layout>
              </div>
            </div>
          </oj-drawer-popup>
        </span>
      </div>
      {/* <button class="addbtn" onClick={open}>
        <div class="orbr-settings-ico oj-ux-ico-settings"></div>
      </button> */}
    </>
  );
}
