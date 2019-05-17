import * as React from 'react'
import { Panel } from '../panel'
import { PanelSizeType } from '../../lib/app-state'
import { IRssItem } from '../../lib/stores'

interface IRSSWidgetProps {
  readonly items: ReadonlyArray<IRssItem>
}

export class RSSWidget extends React.Component<IRSSWidgetProps, {}> {

  private renderRssItem() {
    const items = this.props.items.slice(0, 5)
    return items.map((item: IRssItem, index: number) => {
      return (
        <RssItem
          key={index}
          item={item}
        />
      )
    })
  }

  public render() {
    return (
      <Panel
        size={PanelSizeType.Size2x1}
        title='News'
        className='rss-panel'
      >
        {this.renderRssItem()}
      </Panel>
    )
  }
}

interface IRssItemProps {
  readonly item: IRssItem
}

class RssItem extends React.Component<IRssItemProps, {}> {
  public render() {
    return (
      <div
        className="rss-item-row"
      >
        <h2>{this.props.item.title}</h2>
        <h3>{this.props.item.feedTitle} {this.props.item.formatDate}</h3>
      </div>
    )
  }
}