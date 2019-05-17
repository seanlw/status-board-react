import * as React from 'react'
import { Panel } from '../panel'
import { PanelSizeType } from '../../lib/app-state'
import { IUpcomingEvent } from '../../lib/stores'

interface IUpcomingWidgetProps {
  readonly events: ReadonlyArray<IUpcomingEvent>
}

export class UpcomingWidget extends React.Component<IUpcomingWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={PanelSizeType.Size1x1}
        title='Upcoming'
        className="upcoming-panel-body"
      >
        <div className="upcoming-container">
          {this.renderEvents()}
        </div>
      </Panel>
    )
  }

  public renderEvents() {
    if (!this.props.events) {
      return
    }
    const events = this.props.events.slice(0, 4)

    return events.map((event, index) => {
      return (
        <UpcomingEvent
          key={index}
          days={event.days}
          title={event.title}
        />
      )
    })
  }
}

interface IUpcomingEventProps {
  readonly days: number
  readonly title: string
}

export class UpcomingEvent extends React.Component<IUpcomingEventProps, {}> {
  public render() {
    const dayLabel = this.props.days === 1 ? 'day' : 'days'
    return (
      <div className="upcoming-row">
        <div className="upcoming-days">
          <h3 className="upcoming-day">{this.props.days}</h3>
          <span className="upcoming-day-label">{dayLabel}</span>
        </div>
        <div className="upcoming-title">{this.props.title}</div>
      </div>
    )
  }
}