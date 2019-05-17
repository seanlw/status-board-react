import { TypedBaseStore } from './base-store'
import * as GoogleSpreadsheet from 'google-spreadsheet'

export interface IUpcomingState {
  readonly url: string
  readonly events?: ReadonlyArray<IUpcomingEvent> | undefined
}

export interface IUpcomingEvent {
  readonly days: number
  readonly title: string
}

export class UpcomingStore extends TypedBaseStore<IUpcomingState | null> {
  private state: IUpcomingState | null = null

  public getState(): IUpcomingState | null {
    return this.state
  }

  public setState(state: IUpcomingState | null) {
    this.state = state
    this.emitUpdate(this.getState())
  }

  public async updateEvents(): Promise<any> {
    if (!this.state) {
      return
    }
    const currentState = this.state
    const id = this.getGsIdFromUrl(currentState.url)

    if (id === '') {
      this.emitError(
        new Error(
          "Unable to get Google Sheet ID for Upcoming widget"
        )
      )
    }
    else {
      const doc = new GoogleSpreadsheet(id)
      doc.getInfo((err: Error, info: any) => {
        if (err) {
          this.emitError(err)
          return
        }
        const worksheet = info.worksheets[0]
        worksheet.getRows({
          orderby: 'date'
        },
          (err: Error, rows: any) => {
            if (err) {
              this.emitError(err)
              return
            }
            const events: ReadonlyArray<IUpcomingEvent> = rows.map((row: any) => {
              const date = new Date(row.date)
              const days = Math.floor((date.getTime() - Date.now()) / (60 * 60 * 24 * 1000)) + 1
              return {
                days: days,
                title: row.title
              }
            })
              .filter((event: IUpcomingEvent) => {
                return event.days >= 0
              })

            this.setState({ ...currentState, events: events })
          })
      })
    }
  }

  public startUpcomingUpdater() {
    window.setTimeout(() => {
      const currentState = this.state
      if (currentState && currentState.url !== '') {
        this.updateEvents()
        this.startUpcomingUpdater()
      }
    }, 600000)
  }

  private getGsIdFromUrl(url: string): string {
    if (!url) { return '' }
    const found = url.match(/https:\/\/.*\/d\/([^\/]*)\//)
    return (found === null) ? '' : found[1]
  }

}