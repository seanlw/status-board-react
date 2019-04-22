import * as React from 'react';
import { Panel } from '../panel';

interface IWeatherWidgetProps {

}

export class WeatherWidget extends React.Component<IWeatherWidgetProps, {}> {

  public render() {
    return (
      <Panel
        size={Array(1, 1)}
      ></Panel>
    )
  }
}