import * as React from 'react';
import { Panel } from '../panel';

interface IUpcomingWidgetProps {

}

export class UpcomingWidget extends React.Component<IUpcomingWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={Array(1, 1)}
      ></Panel>
    )
  }
}