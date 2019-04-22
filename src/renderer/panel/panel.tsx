import * as React from 'react'
import * as classNames from 'classnames'

interface IPanelProps {
  readonly size: ReadonlyArray<number>
}

export class Panel extends React.Component<IPanelProps, {}> {

  public render() {
    const className = classNames('panel', `panel-size-${this.props.size[0]}x${this.props.size[1]}`)

    return (
      <div className={className}>
        {this.props.children}
      </div>
    )
  }
}