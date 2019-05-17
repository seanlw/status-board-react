import { AppStore } from '../stores'
import { Popup } from '../app-state'
import { IRssFeed, IServer } from '../preferences'

export class Dispatcher {
  private readonly appStore: AppStore

  public constructor(appStore: AppStore) {
    this.appStore = appStore
  }

  public loadInitialState(): Promise<void> {
    return this.appStore.loadInitialState()
  }

  public async postError(error: Error): Promise<void> {
    return this.appStore._pushError(error)
  }

  public showPopup(popup: Popup): Promise<void> {
    return this.appStore._showPopup(popup)
  }

  public closePopup(): Promise<void> {
    return this.appStore._closePopup()
  }

  public setPreferencesDarkSky(
    apiKey: string,
    latitude: number,
    longitude: number,
    city: string,
    state: string
  ): Promise<void> {
    return this.appStore._setPreferencesDarkSky(apiKey, latitude, longitude, city, state)
  }

  public setPreferencesCountdown(title: string, date: string, time: string): Promise<void> {
    return this.appStore._setPreferencesCountdown(title, date, time)
  }

  public setPreferencesUpcoming(url: string): Promise<void> {
    return this.appStore._setPreferencesUpcoming(url)
  }

  public setPreferencesBoardGameGeek(username: string): Promise<void> {
    return this.appStore._setPreferencesBoardGameGeek(username)
  }

  public setPreferencesRssFeeds(feed: ReadonlyArray<IRssFeed>): Promise<void> {
    return this.appStore._setPreferencesRssFeeds(feed)
  }

  public setPreferencesPingdom(
    api: string,
    username: string,
    password: string,
    servers: ReadonlyArray<IServer>
  ): Promise<any> {
    return this.appStore._setPreferencesPingdom(api, username, password, servers)
  }

  public async loadPingdomHosts(): Promise<void> {
    return this.appStore._loadPingdomHosts()
  }
}