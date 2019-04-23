import * as React from 'react';
import { Panel } from '../panel';

import { PanelSizeType } from '../../lib/app-state'

interface IBoardGameGeekPlaysWidgetProps {

}

export class BoardGameGeekPlaysWidget extends React.Component<IBoardGameGeekPlaysWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={PanelSizeType.Size3x1}
      ></Panel>
    )
  }
}