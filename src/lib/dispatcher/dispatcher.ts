import { AppStore } from '../stores'
import { Popup } from '../app-state'

export class Dispatcher {
  private readonly appStore: AppStore

  public constructor(appStore: AppStore) {
    this.appStore = appStore
  }

  public loadInitialState(): Promise<void> {
    return this.appStore.loadInitialState()
  }

  public showPopup(popup: Popup): Promise<void> {
    return this.appStore._showPopup(popup)
  }

  public closePopup(): Promise<void> {
    return this.appStore._closePopup()
  }

  public setPreferencesDarkSky(apiKey: string, latitude: number, longitude: number): Promise<void> {
    return this.appStore._setPreferencesDarkSky(apiKey, latitude, longitude)
  }
}