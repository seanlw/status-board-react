import { IAppState } from '../app-state'
import { TypedBaseStore } from './base-store'

export class AppStore extends TypedBaseStore<IAppState> {

  private emitQueued = false

  private datetime: Date = new Date()

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
      datetime: this.datetime
    }
  }

  public async loadInitialState() {
    this.datetimeUpdater()

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
}