import * as React from 'react';
import { Panel } from '../panel';

interface IRSSWidgetProps {

}

export class RSSWidget extends React.Component<IRSSWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={Array(2, 1)}
      ></Panel>
    )
  }
}