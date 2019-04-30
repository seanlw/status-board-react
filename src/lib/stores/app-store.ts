import {
  IAppState,
  Popup,
  PopupType
} from '../app-state'
import { TypedBaseStore } from './base-store'
import {
  DarkSkyStore,
  UpcomingStore,
  BoardGameGeekStore,
  RssStore,
  PingdomStore,
  IUpcomingState,
  IUpcomingEvent,
  IBoardGameGeekStoreState,
  IBoardGameGeekPlay,
  IRssItem,
  IRssStoreState,
  IPingdomStoreState,
  IPingdomHost,
  IPingdomCheck
} from '../stores'
import { IPreferences, IRssFeed, IServer } from '../preferences'
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
  rss: [{ url: '' }],
  upcomingUrl: '',
  pingdom: {
    apiKey: '',
    username: '',
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
  private events: ReadonlyArray<IUpcomingEvent> = []
  private plays: ReadonlyArray<IBoardGameGeekPlay> = []
  private rssItems: ReadonlyArray<IRssItem> = []
  private availablePingdomHosts: ReadonlyArray<IPingdomHost> = []
  private hosts: IPingdomCheck | null = null
  private errors: ReadonlyArray<Error> = []

  private readonly darkSkyStore: DarkSkyStore
  private readonly upcomingStore: UpcomingStore
  private readonly boardGameGeekStore: BoardGameGeekStore
  private readonly rssStore: RssStore
  private readonly pingdomStore: PingdomStore

  public constructor(
    darkSkyStore: DarkSkyStore,
    upcomingStore: UpcomingStore,
    boardGameGeekStore: BoardGameGeekStore,
    rssStore: RssStore,
    pingdomStore: PingdomStore
  ) {
    super()

    this.darkSkyStore = darkSkyStore
    this.upcomingStore = upcomingStore
    this.boardGameGeekStore = boardGameGeekStore
    this.rssStore = rssStore
    this.pingdomStore = pingdomStore

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

    this.upcomingStore.onDidError(error => this.emitError(error))
    this.upcomingStore.onDidUpdate(data =>
      this.onUpcomingStoreUpdate(data)
    )

    this.boardGameGeekStore.onDidError(error => this.emitError(error))
    this.boardGameGeekStore.onDidUpdate(data =>
      this.onBoardGameGeekStoreUpdate(data)
    )

    this.rssStore.onDidError(error => this.emitError(error))
    this.rssStore.onDidUpdate(data =>
      this.onRssStoreUpdate(data)
    )

    this.pingdomStore.onDidError(error => this.emitError(error))
    this.pingdomStore.onDidUpdate(data =>
      this.onPingdomStoreUpdate(data)
    )
  }

  public getState(): IAppState {
    return {
      errors: this.errors,
      preferences: this.preferences,
      datetime: this.datetime,
      currentPopup: this.currentPopup,
      forcast: this.forcast,
      events: this.events,
      plays: this.plays,
      rssItems: this.rssItems,
      availablePingdomHosts: this.availablePingdomHosts,
      hosts: this.hosts
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

      this.upcomingStore.setState({
        url: this.preferences.upcomingUrl
      })
      this.upcomingStore.updateEvents()
      this.upcomingStore.startUpcomingUpdater()

      this.boardGameGeekStore.setState({
        username: this.preferences.boardGameGeekUsername
      })
      this.boardGameGeekStore.updatePlays()
      this.boardGameGeekStore.startBoardGameGeekUpdater()

      this.rssStore.setState({
        rssFeeds: this.preferences.rss
      })
      this.rssStore.updateRssFeeds()
      this.rssStore.startRssFeedsUpdater()

      this.pingdomStore.setState({
        apiKey: this.preferences.pingdom.apiKey,
        username: this.preferences.pingdom.username
      })
      this.pingdomStore.updateChecks()
      this.pingdomStore.startPingdomUpdater()

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

  public async _pushError(error: Error): Promise<any> {
    const newErrors = Array.from(this.errors)
    newErrors.push(error)
    this.errors = newErrors
    this.emitUpdate()

    console.error(error)

    return Promise.resolve()
  }

  public _clearError(error: Error): Promise<void> {
    this.errors = this.errors.filter(e => e !== error)
    this.emitUpdate()

    return Promise.resolve()
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

    this.upcomingStore.setState({ url: url })
    this.upcomingStore.updateEvents()

    electronStore.set('preferences', JSON.stringify(this.preferences))

    this.emitUpdate()
    return Promise.resolve()
  }

  public _setPreferencesBoardGameGeek(username: string): Promise<void> {
    this.preferences.boardGameGeekUsername = username

    electronStore.set('preferences', JSON.stringify(this.preferences))

    this.boardGameGeekStore.setState({ username: username })
    this.boardGameGeekStore.updatePlays()

    this.emitUpdate()
    return Promise.resolve()
  }

  public _setPreferencesRssFeeds(feeds: ReadonlyArray<IRssFeed>): Promise<void> {
    this.preferences.rss = feeds

    electronStore.set('preferences', JSON.stringify(this.preferences))

    this.rssStore.setState({ rssFeeds: feeds })
    this.rssStore.updateRssFeeds()

    this.emitUpdate()
    return Promise.resolve()
  }

  public _setPreferencesPingdom(
    key: string,
    username: string,
    password: string,
    servers: ReadonlyArray<IServer>
  ): Promise<any> {

    this.preferences.pingdom.apiKey = key
    this.preferences.pingdom.username = username
    this.preferences.pingdom.servers = servers

    electronStore.set('preferences', JSON.stringify(this.preferences))

    const currentState = this.pingdomStore.getState()
    this.pingdomStore.setState({
      ...currentState,
      apiKey: key,
      username: username,
      password: password
    })
    this.pingdomStore.updateChecks()

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

  private onUpcomingStoreUpdate(data: IUpcomingState | null) {
    if (!data) {
      return
    }

    this.events = data.events || []
    this.emitUpdate()
  }

  private onBoardGameGeekStoreUpdate(data: IBoardGameGeekStoreState | null) {
    if (!data) {
      return
    }

    this.plays = data.plays || []
    this.emitUpdate()
  }

  private onRssStoreUpdate(data: IRssStoreState | null) {
    if (!data) {
      return
    }

    this.rssItems = data.rssItems || []
    this.emitUpdate()
  }

  private onPingdomStoreUpdate(data: IPingdomStoreState | null) {
    if (!data) {
      return
    }
    if (data.checks) {
      this.availablePingdomHosts = data.checks.checks || []
      this.hosts = data.checks
    }

    this.emitUpdate()
  }

  public async _loadPingdomHosts(): Promise<any> {
    const hosts = await this.pingdomStore.getHosts()
    this.availablePingdomHosts = hosts

    this.emitUpdate()
  }

}