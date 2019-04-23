import * as React from 'react';
import { Panel } from '../panel';
import { PanelSizeType } from '../../lib/app-state'

interface IRSSWidgetProps {

}

export class RSSWidget extends React.Component<IRSSWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={PanelSizeType.Size2x1}
      ></Panel>
    )
  }
}