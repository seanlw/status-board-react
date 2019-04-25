import * as React from 'react'
import { Panel } from '../panel'
import * as classNames from 'classnames'
import { PanelSizeType } from '../../lib/app-state'
import { IDarkSkyForcast } from '../../lib/stores'

interface IWeatherWidgetProps {
  readonly city: string
  readonly state: string
  readonly forcast: IDarkSkyForcast | null | undefined
}

export class WeatherWidget extends React.Component<IWeatherWidgetProps, {}> {

  public render() {
    const title = (this.props.city && this.props.state)
      ? `${this.props.city}, ${this.props.state}`
      : ''

    return (
      <Panel
        size={PanelSizeType.Size1x1}
        title={title}
        titleAlignment='center'
      >
        {this.renderWeather()}
        <div className="weather-forcast">
          {this.renderDayForcast()}
        </div>
      </Panel>
    )
  }

  public renderWeather() {
    if (!this.props.forcast) {
      return
    }

    const temp = Math.round(this.props.forcast.currently.temperature) || ''
    return (
      <div className="weather-temp">
        <span className="weather-degrees">{temp}</span>
        <span className="weather-degree-sign">&deg;</span>
      </div>
    )
  }

  public renderDayForcast() {
    if (!this.props.forcast) {
      return
    }

    const days = this.props.forcast.daily.data.slice(1, 5)
    return days.map((day, index) => {
      const time = new Date(day.time * 1000)
      return (
        <WeatherDay
          key={index}
          weekday={this.getWeekday(time.getDay())}
          high={day.temperatureHigh}
          low={day.temperatureLow}
          icon={day.icon}
        />
      )
    })
  }

  private getWeekday(weekday: number): string {
    const weekdays = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thr",
      "Fri",
      "Sat",
      "Sun"
    ]
    return weekdays[weekday]
  }
}

interface IWeatherDayProps {
  readonly weekday: string
  readonly high: number
  readonly low: number
  readonly icon: string
}

export class WeatherDay extends React.Component<IWeatherDayProps, {}> {
  public render() {
    const className = classNames("weather-day-forcast", this.convertIcon(this.props.icon))
    return (
      <div className={className}>
        <h3 className="weather-weekday">{this.props.weekday}</h3>
        <h3 className="weather-high">{Math.round(this.props.high)}</h3>
        <h3 className="weather-low">{Math.round(this.props.low)}</h3>
      </div>
    )
  }

  private convertIcon(icon: string): string {
    switch (icon) {
      case 'rain':
        return 'weather-rain'
      case 'snow':
      case 'sleet':
        return 'weather-snow'
      case 'cloudy':
      case 'fog':
        return 'weather-cloud'
      case 'partly-cloudy-day':
      case 'partly-cloudy-night':
        return 'weather-cloud-sun'
      default:
        return 'weather-sun'
    }
  }
}