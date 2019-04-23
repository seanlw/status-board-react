import * as React from 'react';
import { Panel } from '../panel';
import { PanelSizeType } from '../../lib/app-state'

interface ICountdownWidgetProps {

}

export class CountdownWidget extends React.Component<ICountdownWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={PanelSizeType.Size1x1}
      ></Panel>
    )
  }
}