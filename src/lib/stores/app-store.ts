import {
  IAppState,
  Popup,
  PopupType
} from '../app-state'
import { TypedBaseStore } from './base-store'
import { DarkSkyStore } from '../stores'
import { IPreferences } from '../preferences'
import { IDarkSkyForcast } from '../stores'
import { IDarkSkyState } from './dark-sky-store'
import * as ElectronStore from 'electron-store'

const electronStore = new ElectronStore({ name: 'status-board' })

const defaultPreferences: IPreferences = {
  countdown: {
    title: '',
    date: '',
    time: ''
  },
  rss: [],
  upcomingUrl: '',
  pingdom: {
    apiKey: '',
    username: '',
    password: '',
    servers: []
  },
  darksky: {
    apiKey: '',
    latitude: null,
    longitude: null,
    city: '',
    state: ''
  },
  boardGameGeekUsername: ''
}

export class AppStore extends TypedBaseStore<IAppState> {

  private emitQueued = false

  private datetime: Date = new Date()
  private currentPopup: Popup | null = null
  private preferences: IPreferences = defaultPreferences
  private forcast: IDarkSkyForcast | null | undefined = null

  private readonly darkSkyStore: DarkSkyStore

  public constructor(darkSkyStore: DarkSkyStore) {
    super()

    this.darkSkyStore = darkSkyStore

    this.wireupStoreEventHandlers()
  }

  protected emitUpdate() {
    if (this.emitQueued) {
      return
    }
    this.emitQueued = true
    this.emitUpdateNow()
  }

  private emitUpdateNow() {
    this.emitQueued = false
    const state = this.getState()
    super.emitUpdate(state)
  }

  private wireupStoreEventHandlers() {

    this.darkSkyStore.onDidError(error => this.emitError(error))
    this.darkSkyStore.onDidUpdate(data =>
      this.onDarkSkyStoreUpdated(data)
    )
  }

  public getState(): IAppState {
    return {
      preferences: this.preferences,
      datetime: this.datetime,
      currentPopup: this.currentPopup,
      forcast: this.forcast
    }
  }

  public async loadInitialState() {
    this.preferences = JSON.parse(
      String(electronStore.get('preferences') || null)
    ) as IPreferences

    this.datetimeUpdater()

    if (!this.preferences) {
      this.preferences = defaultPreferences
      this._showPopup({ type: PopupType.Preferences })
    }
    else {
      this.darkSkyStore.setState({
        apiKey: this.preferences.darksky.apiKey,
        latitude: this.preferences.darksky.latitude,
        longitude: this.preferences.darksky.longitude
      })
      this.darkSkyStore.updateForcast()
      this.darkSkyStore.startForcastUpdater()
    }

    this.emitUpdateNow()
  }

  private datetimeUpdater() {
    window.setTimeout(() => {
      const datetime = new Date()
      this.datetime = datetime

      this.emitUpdate()
      this.datetimeUpdater()
    }, 1000)
  }

  public async _showPopup(popup: Popup): Promise<void> {
    this._closePopup()

    this.currentPopup = popup
    this.emitUpdate()
  }

  public _closePopup(): Promise<any> {
    this.currentPopup = null
    this.emitUpdate()

    return Promise.resolve()
  }

  public _setPreferencesDarkSky(
    apiKey: string,
    latitude: number,
    longitude: number,
    city: string,
    state: string
  ): Promise<void> {

    this.preferences.darksky.apiKey = apiKey
    this.preferences.darksky.latitude = latitude
    this.preferences.darksky.longitude = longitude
    this.preferences.darksky.city = city
    this.preferences.darksky.state = state

    this.darkSkyStore.setState({
      apiKey: apiKey,
      latitude: latitude,
      longitude: longitude
    })
    this.darkSkyStore.updateForcast()

    electronStore.set('preferences', JSON.stringify(this.preferences))

    this.emitUpdate()
    return Promise.resolve()
  }

  public _setPreferencesCountdown(title: string, date: string, time: string): Promise<void> {
    this.preferences.countdown.title = title
    this.preferences.countdown.date = date
    this.preferences.countdown.time = time

    electronStore.set('preferences', JSON.stringify(this.preferences))

    this.emitUpdate()
    return Promise.resolve()
  }

  public _setPreferencesUpcoming(url: string): Promise<void> {
    this.preferences.upcomingUrl = url

    electronStore.set('preferences', JSON.stringify(this.preferences))

    this.emitUpdate()
    return Promise.resolve()
  }

  public _setPreferencesBoardGameGeek(username: string): Promise<void> {
    this.preferences.boardGameGeekUsername = username

    electronStore.set('preferences', JSON.stringify(this.preferences))

    this.emitUpdate()
    return Promise.resolve()
  }

  private onDarkSkyStoreUpdated(data: IDarkSkyState | null) {
    if (!data) {
      return
    }

    this.forcast = data.forcast
    this.emitUpdate()
  }

}