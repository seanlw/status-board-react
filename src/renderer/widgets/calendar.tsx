import * as React from 'react'
import { Panel } from '../panel'
import { PanelSizeType } from '../../lib/app-state'

interface ICalendarWidgetProps {
  readonly datetime: Date
}

interface ICalendarWidgetState {
  readonly month: string
  readonly day: number
  readonly weekday: string
}

export class CalendarWidget extends React.Component<ICalendarWidgetProps, ICalendarWidgetState> {

  public constructor(props: ICalendarWidgetProps) {
    super(props)

    this.state = {
      month: this.getMonth(props.datetime.getMonth()),
      day: props.datetime.getDate(),
      weekday: this.getDay(props.datetime.getDate())
    }
  }

  public componentWillReceiveProps(nextProps: ICalendarWidgetProps) {
    this.setState({
      month: this.getMonth(nextProps.datetime.getMonth()),
      day: nextProps.datetime.getDate(),
      weekday: this.getDay(nextProps.datetime.getDay())
    })
  }

  private getMonth(month: number): string {
    const monthString = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    return monthString[month]
  }

  private getDay(day: number): string {
    const dayString = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]
    return dayString[day]
  }

  public render() {
    return (
      <Panel
        size={PanelSizeType.Size1x1}
        title={this.state.weekday}
        titleAlignment='center'
      >
        <div className="calendar-month">{this.state.month}</div>
        <div className="calendar-day">{this.state.day}</div>
      </Panel>
    )
  }
}