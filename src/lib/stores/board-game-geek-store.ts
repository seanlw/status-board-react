import { TypedBaseStore } from './base-store'
import * as request from 'request-promise'

export interface IBoardGameGeekStoreState {
  readonly username: string
  readonly plays?: ReadonlyArray<IBoardGameGeekPlay>
}

export interface IBoardGameGeekPlay {
  readonly name: string
  readonly date: string
  readonly timestamp: number
  readonly location: string
}

const bggEndpoint = 'https://www.boardgamegeek.com/xmlapi2/'

export class BoardGameGeekStore extends TypedBaseStore<IBoardGameGeekStoreState | null> {

  private state: IBoardGameGeekStoreState | null = null

  public getState(): IBoardGameGeekStoreState | null {
    return this.state
  }

  public setState(state: IBoardGameGeekStoreState | null) {
    this.state = state
    this.emitUpdate(this.getState())
  }

  public async updatePlays(): Promise<any> {
    if (!this.state || !this.state.username) {
      return
    }
    const currentState = this.state

    let plays: Array<IBoardGameGeekPlay> = []

    let page = 1
    do {
      const currentPlays = await this.getPlays(page)
      for (let play of currentPlays) {
        const date = play.getAttribute('date')

        plays.push({
          name: play.getElementsByTagName('item')[0].getAttribute('name'),
          date: date,
          timestamp: new Date(date).getTime(),
          location: play.getAttribute('location')
        })
      }
      page++
    } while (plays.length === 100)

    this.setState({ ...currentState, plays: plays })
  }

  private async getPlays(page: number = 1): Promise<any> {
    if (!this.state) {
      return null
    }
    const options = {
      url: `${bggEndpoint}/plays?username=${this.state.username}&type=thing&subtype=boardgame&page=${page}`,
      headers: {
        Connection: 'keep-alive'
      },
      forever: true,
      json: true,
      resolveWithFullResponse: true,
      simple: false
    }
    return request(options)
      .then((response) => {
        const xml = String(response.body)
        const parser = new DOMParser()
        const doc = parser.parseFromString(xml, 'application/xml')

        return doc.getElementsByTagName('play')
      })
  }

  public startBoardGameGeekUpdater() {
    window.setTimeout(() => {
      const currentState = this.state
      if (currentState && currentState.username !== '') {
        this.updatePlays()
        this.startBoardGameGeekUpdater()
      }
    }, 1 * 60 * 60 * 1000)
  }

}