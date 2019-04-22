import * as React from 'react';
import { Panel } from '../panel';

interface IPingdomWidgetProps {

}

export class PingdomWidget extends React.Component<IPingdomWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={Array(2, 1)}
      ></Panel>
    )
  }
}