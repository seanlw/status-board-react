import { IPreferences } from "./preferences";

export type Popup =
  | { type: PopupType.Preferences }

export interface IAppState {
  readonly datetime: Date
  readonly currentPopup: Popup | null
  readonly preferences: IPreferences
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