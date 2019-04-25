import { TypedBaseStore } from './base-store'
import * as request from 'request-promise'

export interface IDarkSkyForcast {
  latitude: number
  longitude: number
  timezone: string
  currently: IDarkSkyCondition
  minutely: IDarkSkyData
  hourly: IDarkSkyData
  daily: IDarkSkyData
  alerts: ReadonlyArray<IDarkSkyAlert>
}

export interface IDarkSkyCondition {
  time: number
  summary: string
  icon: string
  sunriseTime: number
  sunsetTime: number
  moonPhase: number
  nearestStormDistance: number
  precipIntensity: number
  precepProbability: number
  percipIntensityMax: number
  percipIntensityMaxTime: number
  percipType: string
  temperatureHigh: number
  temperatureHighTime: number
  temperatureLow: number
  temperatureLowTime: number
  apparentTemperatureHigh: number
  apparentTemperatureHighTime: number
  apparentTemperatureLow: number
  apparentTemperatureLowTime: number
  temperature: number
  aparentTemperature: number
  dewPoint: number
  humidity: number
  pressure: number
  windSpeed: number
  windGust: number
  windGustTime: number
  windBearing: number
  cloudCover: number
  uvIndex: number
  visibility: number
  ozone: number
  temperatureMin: number
  temperatureMinTime: number
  temperatureMax: number
  temperatureMaxTime: number
  apparentTemperatureMin: number
  apparentTemperatureMinTime: number
  apparentTemperatureMax: number
  apparentTemperatureMaxTime: number
}

export interface IDarkSkyData {
  summary: string
  icon: string
  data: ReadonlyArray<IDarkSkyCondition>
}

export interface IDarkSkyAlert {
  title: string
  time: number
  expires: number
  description: string
}


export interface IDarkSkyState {
  readonly forcast?: IDarkSkyForcast | null | undefined
  readonly apiKey: string
  readonly latitude: number | null
  readonly longitude: number | null
}

const darkSkyForecastEndpoint = 'https://api.darksky.net/forecast'

export class DarkSkyStore extends TypedBaseStore<IDarkSkyState | null> {

  private state: IDarkSkyState | null = null

  public getState(): IDarkSkyState | null {
    return this.state
  }

  public setState(state: IDarkSkyState | null) {
    this.state = state
    this.emitUpdate(this.getState())
  }

  public async updateForcast(): Promise<any> {
    if (!this.state) {
      return
    }

    const currentState = this.state

    if (currentState.apiKey === '') {
      this.emitError(
        new Error("No API key set to get Dark Sky forcast data")
      )
    }
    else if (currentState.latitude === null) {
      this.emitError(
        new Error("No latitude set to get Dark Sky forcast data")
      )
    }
    else if (currentState.longitude === null) {
      this.emitError(
        new Error("No longitude set to get Dark Sky forcast data")
      )
    }
    else {
      const options = {
        url: `${darkSkyForecastEndpoint}/${currentState.apiKey}/${currentState.latitude},${currentState.longitude}`,
        headers: {
          Connection: 'keep-alive'
        },
        forever: true,
        json: true,
        resolveWithFullResponse: true,
        simple: false
      }

      return request(options)
        .then((response: any) => {
          this.setState({ ...currentState, forcast: response.body as IDarkSkyForcast })
        })
        .catch((err: Error) => {
          this.emitError(err)
        })
    }
  }

  public startForcastUpdater() {
    window.setTimeout(() => {
      const currentState = this.state
      if (
        currentState &&
        currentState.apiKey !== '' &&
        currentState.latitude &&
        currentState.longitude
      ) {
        this.updateForcast()
        this.startForcastUpdater()
      }
    }, 600000)
  }

}