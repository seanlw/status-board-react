import * as React from 'react'

import { DialogContent } from '../dialog'
import { Row } from '../layout'
import { TextBox } from '../form'
import { IRssFeed } from '../../lib/preferences'
import { Button } from '../button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/free-solid-svg-icons"

interface IRssFeedsPreferencesProps {
  readonly rssFeeds: ReadonlyArray<IRssFeed>

  readonly onRssFeedsChanged: (index: number, value: string) => void
  readonly onRssFieldInsert: (index: number) => void
  readonly onRssFieldRemove: (index: number) => void
}

export class RssFeedsPreferences extends React.Component<IRssFeedsPreferencesProps, {}> {

  private hideRemoveField(): boolean {
    return this.props.rssFeeds.length <= 1
  }

  public renderHeader() {
    return (
      <Row className="header">
        <div className="url">Feed Url</div>
        <div className="action"></div>
      </Row>
    )
  }

  public renderRssFeeds() {
    return this.props.rssFeeds.map((feed: IRssFeed, index: number) => {
      return (
        <RssFeedItem
          key={index}
          index={index}
          value={feed}
          onFieldValueChanged={this.props.onRssFeedsChanged}
          onFieldInsert={this.props.onRssFieldInsert}
          onFieldRemove={this.props.onRssFieldRemove}
          hideRemoveField={this.hideRemoveField()}
        />
      )
    })
  }

  public render() {
    return (
      <DialogContent
        className="rss-preferences-container"
      >
        {this.renderHeader()}
        {this.renderRssFeeds()}
      </DialogContent>
    )
  }
}

interface IRssFeedItemProps {
  readonly value: IRssFeed
  readonly index: number
  readonly hideRemoveField?: boolean
  readonly hideInsertField?: boolean

  readonly onFieldValueChanged: (index: number, value: string) => void
  readonly onFieldInsert: (index: number) => void
  readonly onFieldRemove: (index: number) => void
}

class RssFeedItem extends React.Component<IRssFeedItemProps, {}> {

  private onFeedValueChanged = (value: string) => {
    this.props.onFieldValueChanged(this.props.index, value)
  }

  private onFieldInsert = () => {
    this.props.onFieldInsert(this.props.index)
  }

  private onFieldRemove = () => {
    this.props.onFieldRemove(this.props.index)
  }

  private renderRemoveButton() {
    if (this.props.hideRemoveField) {
      return null
    }
    return (
      <Button
        onClick={this.onFieldRemove}
      >
        <FontAwesomeIcon
          icon={Icons.faMinus}
          size="sm"
        />
      </Button>
    )
  }

  private renderInsertButton() {
    if (this.props.hideInsertField) {
      return null
    }
    return (
      <Button
        onClick={this.onFieldInsert}
      >
        <FontAwesomeIcon
          icon={Icons.faPlus}
          size="sm"
        />
      </Button>
    )
  }

  public render() {
    return (
      <Row>
        <TextBox
          value={this.props.value.url}
          onValueChanged={this.onFeedValueChanged}
        />
        {this.renderRemoveButton()}
        {this.renderInsertButton()}
      </Row>
    )
  }

}