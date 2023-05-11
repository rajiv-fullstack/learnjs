import React, {Component} from 'react';
import {DayPilot, DayPilotScheduler} from "daypilot-pro-react";

class Timesheet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      locale: "en-us",
      rowHeaderColumns: [
        {name: "Task"},
        {name: "Days", width: 40}
      ],
      onBeforeRowHeaderRender: (args) => {
        args.row.columns[0].horizontalAlignment = "center";
        args.row.columns[1].text = args.row.start.toString("ddd");
        if (args.row.columns[2]) {
          args.row.columns[2].text = args.row.events.totalDuration().toString("h:mm");

        }
      },
      onBeforeEventRender: (args) => {
        const duration = new DayPilot.Duration(args.data.start, args.data.end);
        args.data.areas = [
          {
            top: 10,
            right: 5,
            text: duration.toString("h:mm"),
            fontColor: "#999999"
          }
        ];
      },
      cellWidthSpec: "Auto",
      cellWidthMin: 25,
      timeHeaders: [{"groupBy":"Hour"},{"groupBy":"Cell","format":"mm"}],
      scale: "CellDuration",
      cellDuration: 15,
      days: DayPilot.Date.today().daysInMonth(),
      viewType: "Days",
      // startDate: DayPilot.Date.today().firstDayOfMonth(),
      showNonBusiness: true,
      allowEventOverlap: false,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: async (args) => {
        const dp = args.control;
        const modal = await DayPilot.Modal.prompt("Create a new Task:", "Task 1");
        dp.clearSelection();
        if (modal.canceled) { return; }
        dp.events.add({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          resource: args.resource,
          text: modal.result
        });
      },
    };
  }

  componentDidMount() {

    // load resource and event data
    this.setState({
      events: [
        {
          id: 1,
          text: "Task 1",
          start: "2021-07-02T10:00:00",
          end: "2021-07-02T11:00:00",
        },
        {
          id: 2,
          text: "Task 2",
          start: "2021-07-05T09:30:00",
          end: "2021-07-05T11:30:00",
          barColor: "#38761d",
          barBackColor: "#93c47d"
        },
        {
          id: 3,
          text: "Task 3",
          start: "2021-07-07T10:30:00",
          end: "2021-07-07T13:30:00",
          barColor: "#f1c232",
          barBackColor: "#ffd966"
        }
      ]
    });

    this.scheduler.scrollTo(DayPilot.Date.today().firstDayOfMonth().addHours(9));

  }

  changeBusiness() {
    const businessOnly = this.checkboxBusiness.checked;
    this.setState({
      showNonBusiness: !businessOnly
    });
  }

  changeSummary() {
    const showSummary = this.checkboxSummary.checked;

    if (showSummary) {
      this.setState({
        rowHeaderColumns: [
          {name: "Date"},
          {name: "Day", width: 40},
          {name: "Total", width: 60}
        ]
      });
    }
    else {
      this.setState({
        rowHeaderColumns: [
          {name: "Date"},
          {name: "Day", width: 40}
        ]
      });
    }
  }

  render() {
    var {...config} = this.state;
    return (
      <div>
        <div className={"space"}>
        </div>
        <DayPilotScheduler
          {...config}
          ref={component => {
            this.scheduler = component && component.control;
          }}
        />
      </div>
    );
  }
}

export default Timesheet;
