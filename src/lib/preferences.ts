export enum PreferencesTab {
  DarkSky = 0,
  RSS = 1,
  Countdown = 2,
  Pingdom = 3,
  Upcoming = 4,
  BoardGameGeek = 5
}

export interface IPreferences {
  countdown: ICountdown
  rss: ReadonlyArray<IRssFeed>
  upcomingUrl: string
  boardGameGeekUsername: string
  pingdom: IPingdom
  darksky: IDarkSky
}

export interface ICountdown {
  title: string
  date: string
  time: string
}

export interface IRssFeed {
  url: string
}

export interface IPingdom {
  apiKey: string
  username: string
  password: string
  servers: ReadonlyArray<IServer>
}

export interface IServer {
  id: string
}

export interface IDarkSky {
  apiKey: string
  latitude: number | null
  longitude: number | null
  city: string
  state: string
}