import * as React from 'react';
import { Panel } from '../panel';

interface ICalendarWidgetProps {

}

export class CalendarWidget extends React.Component<ICalendarWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={Array(1, 1)}
      ></Panel>
    )
  }
}