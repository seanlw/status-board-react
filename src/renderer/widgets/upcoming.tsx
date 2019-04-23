import * as React from 'react';
import { Panel } from '../panel';
import { PanelSizeType } from '../../lib/app-state'

interface IUpcomingWidgetProps {

}

export class UpcomingWidget extends React.Component<IUpcomingWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={PanelSizeType.Size1x1}
      ></Panel>
    )
  }
}