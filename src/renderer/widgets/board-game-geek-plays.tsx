import * as React from 'react';
import { Panel } from '../panel';

interface IBoardGameGeekPlaysWidgetProps {

}

export class BoardGameGeekPlaysWidget extends React.Component<IBoardGameGeekPlaysWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={Array(3, 1)}
      ></Panel>
    )
  }
}