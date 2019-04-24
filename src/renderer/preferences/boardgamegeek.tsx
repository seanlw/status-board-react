import * as React from 'react'

import { DialogContent } from '../dialog'
import { Row } from '../layout'
import { TextBox } from '../form'

interface IBoardGameGeekPreferencesProps {
  readonly username: string

  readonly onUsernameChanged: (title: string) => void
}

export class BoardGameGeekPreferences extends React.Component<IBoardGameGeekPreferencesProps, {}> {

  public render() {
    return (
      <DialogContent>
        <Row>
          <TextBox
            label="Username"
            value={this.props.username}
            onValueChanged={this.props.onUsernameChanged}
            autoFocus={true}
          />
        </Row>
      </DialogContent>
    )
  }
}