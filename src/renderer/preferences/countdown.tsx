import * as React from 'react'

import { DialogContent } from '../dialog'
import { Row } from '../layout'
import { TextBox } from '../form'

interface ICountdownPreferencesProps {
  readonly title: string
  readonly date: string
  readonly time: string

  readonly onTitleChanged: (title: string) => void
  readonly onDateChanged: (date: string) => void
  readonly onTimeChanged: (time: string) => void
}

export class CountdownPreferences extends React.Component<ICountdownPreferencesProps, {}> {

  public render() {
    return (
      <DialogContent>
        <Row>
          <TextBox
            label="Title"
            value={this.props.title}
            onValueChanged={this.props.onTitleChanged}
            autoFocus={true}
          />
        </Row>
        <Row>
          <TextBox
            label="Date"
            value={this.props.date}
            onValueChanged={this.props.onDateChanged}
          />
        </Row>
        <Row>
          <TextBox
            label="Time"
            value={this.props.time}
            onValueChanged={this.props.onTimeChanged}
          />
        </Row>
      </DialogContent>
    )
  }
}