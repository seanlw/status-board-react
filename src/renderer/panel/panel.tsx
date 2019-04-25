import * as React from 'react'
import * as classNames from 'classnames'
import {
  PanelSizeType,
  TitleAlign
} from '../../lib/app-state'

interface IPanelProps {
  readonly size: PanelSizeType
  readonly title?: string
  readonly titleAlignment?: TitleAlign
  readonly noBodyPadding?: boolean
  readonly className?: string
}

export class Panel extends React.Component<IPanelProps, {}> {

  public render() {
    const className = classNames('panel', `panel-size-${this.props.size}x1`)
    const classNameBody = classNames(
      this.props.className,
      'panel-body',
      this.props.noBodyPadding ? 'no-padding' : 'padding',
    )

    return (
      <div className={className}>
        {this.renderTitle()}
        <div className={classNameBody}>
          {this.props.children}
        </div>
      </div>
    )
  }

  private renderTitle(): JSX.Element | null {
    if (!this.props.title) {
      return null
    }

    const className = classNames('panel-title', this.props.titleAlignment)

    return (
      <h1 className={className}>
        {this.props.title}
      </h1>
    )
  }
}