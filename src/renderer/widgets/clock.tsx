import * as React from 'react'
import { Panel } from '../panel'

import { PanelSizeType } from '../../lib/app-state'

interface IClockWidgetProps {
  readonly datetime: Date
}

interface IClockWidgetState {
  readonly hours: number
  readonly minutes: number
  readonly seconds: number
}

export class ClockWidget extends React.Component<IClockWidgetProps, IClockWidgetState> {

  public constructor(props: IClockWidgetProps) {
    super(props)

    const hours = this.props.datetime.getHours()
    const minutes = this.props.datetime.getMinutes()
    const seconds = this.props.datetime.getSeconds()

    this.state = {
      hours: hours + (minutes / 60),
      minutes: minutes + (seconds / 60),
      seconds: seconds
    }
  }

  public componentWillReceiveProps(nextProps: IClockWidgetProps) {
    const hours = nextProps.datetime.getHours()
    const minutes = nextProps.datetime.getMinutes()
    const seconds = nextProps.datetime.getSeconds()

    this.setState({
      hours: hours + (minutes / 60),
      minutes: minutes + (seconds / 60),
      seconds: seconds
    })
  }

  public render() {
    return (
      <Panel
        size={PanelSizeType.Size1x1}
        noBodyPadding={true}
      >
        <ClockFace />
        <ClockHandHour
          degrees={this.state.hours * 30}
        />
        <ClockHandMinute
          degrees={this.state.minutes * 6}
        />
        <ClockHandSecond
          degrees={this.state.seconds * 6}
        />
      </Panel>
    )
  }
}

export class ClockFace extends React.Component<{}, {}> {
  public render() {
    return (
      <div className="clock-face" />
    )
  }
}

interface IClockHandHourProps {
  readonly degrees: number
}

export class ClockHandHour extends React.Component<IClockHandHourProps, {}> {
  public render() {
    const style = {
      transform: `rotate(${this.props.degrees}deg)`
    }

    return (
      <div
        className="clock-hour-hand"
        style={style}
      />
    )
  }
}

interface IClockHandMinuteProps {
  readonly degrees: number
}

export class ClockHandMinute extends React.Component<IClockHandMinuteProps, {}> {
  public render() {
    const style = {
      transform: `rotate(${this.props.degrees}deg)`
    }

    return (
      <div
        className="clock-minute-hand"
        style={style}
      />
    )
  }
}

interface IClockHandSecondProps {
  readonly degrees: number
}

export class ClockHandSecond extends React.Component<IClockHandSecondProps, {}> {
  public render() {
    const style = {
      transform: `rotate(${this.props.degrees}deg)`
    }

    return (
      <div
        className="clock-second-hand"
        style={style}
      />
    )
  }
}