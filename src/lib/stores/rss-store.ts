import { TypedBaseStore } from './base-store'
import * as request from 'request-promise'
import { IRssFeed } from '../preferences'

export interface IRssStoreState {
  readonly rssFeeds: ReadonlyArray<IRssFeed>
  readonly rssItems?: ReadonlyArray<IRssItem>
}

export interface IRssItem {
  readonly feedTitle: string
  readonly timestamp: number
  readonly title: string
  readonly formatDate: string
}

export class RssStore extends TypedBaseStore<IRssStoreState | null> {

  private state: IRssStoreState | null = null

  public getState(): IRssStoreState | null {
    return this.state
  }

  public setState(state: IRssStoreState | null) {
    this.state = state
    this.emitUpdate(this.getState())
  }

  public async updateRssFeeds(): Promise<any> {
    if (!this.state) {
      return
    }
    const currentState = this.state

    let items: Array<IRssItem> = []
    for (let feed of this.state.rssFeeds) {
      const rss = await this.getRssFeed(feed.url)
      const rssItems = this.formatRss(rss)
      items = items.concat(rssItems)
    }
    items.sort((a: IRssItem, b: IRssItem) => {
      return b.timestamp - a.timestamp
    })

    this.setState({ ...currentState, rssItems: items })
  }

  public startRssFeedsUpdater() {
    window.setTimeout(() => {
      const currentState = this.state
      if (currentState) {
        this.updateRssFeeds()
        this.startRssFeedsUpdater()
      }
    }, 5 * 60 * 1000)
  }

  public async getRssFeed(url: string): Promise<any> {
    if (url === '') {
      return
    }

    const options = {
      url: url,
      headers: {
        Connection: 'keep-alive'
      },
      forever: true,
      json: false,
      resolveWithFullResponse: true,
      simple: false
    }
    return request(options)
      .then((response) => {
        const xml = String(response.body)
        const parser = new DOMParser()
        const doc = parser.parseFromString(xml, 'application/xml')

        return doc
      })
  }

  private formatRss(rss: Document | null): ReadonlyArray<IRssItem> {
    if (!rss) {
      return []
    }

    const title = String(rss.getElementsByTagName('title')[0].childNodes[0].textContent)
    const items = rss.getElementsByTagName('item')
    let returnItems: Array<IRssItem> = []
    for (let item of items) {
      if (!item) {
        continue
      }

      const itemTitle = String(
        item.getElementsByTagName('title')[0].childNodes[0].textContent
      ).replace(/&amp;/g, '&')
      const pubDate = this.getPubDate(item)
      const date = new Date(pubDate)

      returnItems.push({
        feedTitle: title,
        timestamp: date.getTime(),
        title: itemTitle,
        formatDate: this.formatDate(date)
      })
    }
    return returnItems
  }

  private getPubDate(item: Element): string {
    try {
      return String(item.getElementsByTagName('pubDate')[0].childNodes[0].nodeValue)
    }
    catch (e) {
      for (let node of item.childNodes) {
        if (node.nodeName === 'dc:date') {
          return String(node.childNodes[0].nodeValue)
        }
      }
    }
    return ''
  }

  private formatDate(time: Date): string {
    let hours = time.getHours()
    const minutes = time.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'

    hours = hours % 12
    hours = hours ? hours : 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes

    return hours + ':' + minutesStr + ' ' + ampm
  }

}