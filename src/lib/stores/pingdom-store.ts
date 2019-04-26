import { TypedBaseStore } from './base-store'
import * as request from 'request-promise'
import { TokenStore } from './token-store';

export interface IPingdomStoreState {
  readonly apiKey: string
  readonly username: string
  readonly password?: string

  readonly checks?: IPingdomCheck
}

export interface IPingdomCheck {
  readonly checks: ReadonlyArray<IPingdomHost>
  readonly counts: IPingdomCounts
}

export interface IPingdomHost {
  readonly acktimeout: number
  readonly alert_policy: number
  readonly alert_policy_name: string
  readonly autoresolve: number
  readonly created: number
  readonly hostname: string
  readonly id: number
  readonly lasterrortime: number
  readonly lastresponsetime: number
  readonly lasttesttime: number
  readonly name: string
  readonly resolution: number
  readonly status: StatusType
  readonly type: string
  readonly use_legacy_notifications: boolean
}

export interface IPingdomCounts {
  readonly filtered: number
  readonly limited: number
  readonly total: number
}

export type StatusType =
  | 'up'
  | 'down'

const pingdomEndpoint = 'https://api.pingdom.com/api/2.0/checks'

export class PingdomStore extends TypedBaseStore<IPingdomStoreState | null> {
  private state: IPingdomStoreState | null = null

  public getState(): IPingdomStoreState | null {
    return this.state
  }

  public setState(state: IPingdomStoreState | null) {
    if (state && state.password) {
      TokenStore.setItem('pingdom', state.username, state.password)
    }

    this.state = state

    this.emitUpdate(this.getState())
  }

  public async updateChecks(): Promise<any> {
    if (
      !this.state ||
      !this.state.username ||
      !this.state.apiKey
    ) {
      return
    }

    const currentState = this.state
    const password = await TokenStore.getItem('pingdom', currentState.username)

    const options = {
      url: pingdomEndpoint,
      headers: {
        Connection: 'keep-alive',
        Authorization: `Basic ${btoa(`${currentState.username}:${password}`)}`,
        "App-Key": currentState.apiKey
      },
      forever: true,
      json: true,
      resolveWithFullResponse: true,
      simple: false
    }

    return request(options)
      .then((response: any) => {
        this.setState({ ...currentState, checks: response.body as IPingdomCheck })
      })
      .catch((err: Error) => {
        this.emitError(err)
      })
  }

  public async getHosts(): Promise<any> {
    if (!this.state || !this.state.checks) {
      await this.updateChecks()
      const hosts = this.state && this.state.checks ? this.state.checks.checks : []
      return Promise.resolve(hosts)
    }
    return Promise.resolve(this.state.checks ? this.state.checks.checks : [])
  }
}