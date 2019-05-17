import * as React from 'react'
import { Panel } from '../panel'
import { PanelSizeType } from '../../lib/app-state'

interface ICountdownWidgetProps {
  readonly datetime: Date
  readonly title: string
  readonly date: string
  readonly time: string
}

interface ICountdownWidgetState {
  readonly timestamp: Date
  readonly days: number
  readonly hours: number
  readonly minutes: number
  readonly seconds: number
}

export class CountdownWidget extends React.Component<ICountdownWidgetProps, ICountdownWidgetState> {

  public constructor(props: ICountdownWidgetProps) {
    super(props)

    this.state = this.setTimeState(props.date, props.time, props.datetime)
  }

  public componentWillReceiveProps(nextProps: ICountdownWidgetProps) {
    this.setState(this.setTimeState(nextProps.date, nextProps.time, nextProps.datetime))
  }

  public render() {
    return (
      <Panel
        size={PanelSizeType.Size1x1}
        title='Countdown'
      >
        <div className="countdown-title">{this.props.title}</div>
        <div className="countdown-digit-body">
          <Digit
            title='Days'
            digit={this.state.days}
          />
          <Digit
            title='Hours'
            digit={this.state.hours}
          />
          <Digit
            title='Minutes'
            digit={this.state.minutes}
          />
          <Digit
            title='Seconds'
            digit={this.state.seconds}
          />
        </div>
        <h4 className="countdown-remaining">Remaining</h4>
      </Panel>
    )
  }

  private adjustForDST(now: Date, target: Date): number {
    const diff = (now.getTimezoneOffset() - target.getTimezoneOffset() !== 0)
    return diff ? (60 * 60 * 1000) : 0
  }

  private setTimeState(date: string, time: string, datetime: Date): ICountdownWidgetState {
    const _second = 1000
    const _minute = 1000 * 60
    const _hour = 1000 * 60 * 60
    const _day = 1000 * 60 * 60 * 24

    const timestamp = new Date(`${date} ${time}`)
    const diff = timestamp.getTime()
      - datetime.getTime()
      - this.adjustForDST(datetime, timestamp)
      + 1000

    if (isNaN(diff) || diff < 0) {
      return {
        timestamp: timestamp,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }

    return {
      timestamp: timestamp,
      days: Math.floor(diff / _day),
      hours: Math.floor((diff % _day) / _hour),
      minutes: Math.floor((diff % _hour) / _minute),
      seconds: Math.floor((diff % _minute) / _second)
    }
  }
}

interface IDigitProps {
  readonly title: string
  readonly digit: number
}

export class Digit extends React.Component<IDigitProps, {}> {
  public render() {
    return (
      <div className="countdown-digit-container">
        <div className="countdown-digit">{this.props.digit}</div>
        <h3>{this.props.title}</h3>
      </div>
    )
  }
}