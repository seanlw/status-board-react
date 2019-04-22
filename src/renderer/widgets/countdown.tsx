import * as React from 'react';
import { Panel } from '../panel';

interface ICountdownWidgetProps {

}

export class CountdownWidget extends React.Component<ICountdownWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={Array(1, 1)}
      ></Panel>
    )
  }
}