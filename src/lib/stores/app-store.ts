import {
  IAppState,
  Popup,
  PopupType
} from '../app-state'
import { TypedBaseStore } from './base-store'
import { IPreferences } from '../preferences';

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
    longitude: null
  },
  boardGameGeekUsername: ''
}

export class AppStore extends TypedBaseStore<IAppState> {

  private emitQueued = false

  private datetime: Date = new Date()
  private currentPopup: Popup | null = null
  private preferences: IPreferences = defaultPreferences

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

  public getState(): IAppState {
    return {
      preferences: this.preferences,
      datetime: this.datetime,
      currentPopup: this.currentPopup
    }
  }

  public async loadInitialState() {
    this.preferences = JSON.parse(
      String(localStorage.getItem('preferences'))
    ) as IPreferences

    this.datetimeUpdater()

    if (!this.preferences) {
      this.preferences = defaultPreferences
      this._showPopup({ type: PopupType.Preferences })
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

  public _setPreferencesDarkSky(apiKey: string, latitude: number, longitude: number): Promise<void> {

    this.preferences.darksky.apiKey = apiKey
    this.preferences.darksky.latitude = latitude
    this.preferences.darksky.longitude = longitude

    localStorage.setItem('preferences', JSON.stringify(this.preferences))

    return Promise.resolve()
  }

  public _setPreferencesCountdown(title: string, date: string, time: string): Promise<void> {
    this.preferences.countdown.title = title
    this.preferences.countdown.date = date
    this.preferences.countdown.time = time

    localStorage.setItem('preferences', JSON.stringify(this.preferences))

    return Promise.resolve()
  }

  public _setPreferencesUpcoming(url: string): Promise<void> {
    this.preferences.upcomingUrl = url

    localStorage.setItem('preferences', JSON.stringify(this.preferences))

    return Promise.resolve()
  }

}