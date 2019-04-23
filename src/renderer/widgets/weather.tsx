import * as React from 'react';
import { Panel } from '../panel';
import { PanelSizeType } from '../../lib/app-state'

interface IWeatherWidgetProps {

}

export class WeatherWidget extends React.Component<IWeatherWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={PanelSizeType.Size1x1}
      ></Panel>
    )
  }
}