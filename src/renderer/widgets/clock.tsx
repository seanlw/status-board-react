import * as React from 'react';
import { Panel } from '../panel';

interface IClockWidgetProps {
  readonly datetime: Date
}

export class ClockWidget extends React.Component<IClockWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={Array(1, 1)}
      ></Panel>
    )
  }
}