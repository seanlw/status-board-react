import * as React from 'react';
import { Panel } from '../panel';
import { PanelSizeType } from '../../lib/app-state'

interface IPingdomWidgetProps {

}

export class PingdomWidget extends React.Component<IPingdomWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={PanelSizeType.Size2x1}
      ></Panel>
    )
  }
}