export interface IAppState {
  readonly datetime: Date
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