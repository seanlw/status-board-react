import { IPreferences } from "./preferences"
import {
  IDarkSkyForcast,
  IUpcomingEvent,
  IBoardGameGeekPlay,
  IRssItem,
  IPingdomHost,
  IPingdomCheck
} from "./stores"

export type Popup =
  | { type: PopupType.Preferences }

export interface IAppState {
  readonly datetime: Date
  readonly currentPopup: Popup | null
  readonly preferences: IPreferences
  readonly forcast: IDarkSkyForcast | null | undefined
  readonly events: ReadonlyArray<IUpcomingEvent>
  readonly plays: ReadonlyArray<IBoardGameGeekPlay>
  readonly rssItems: ReadonlyArray<IRssItem>
  readonly availablePingdomHosts: ReadonlyArray<IPingdomHost>
  readonly hosts: IPingdomCheck | null
}

export enum PanelSizeType {
  Size1x1 = 1,
  Size2x1 = 2,
  Size3x1 = 3
}

export type TitleAlign =
  | 'left'
  | 'right'
  | 'center'

export enum PopupType {
  Preferences
}