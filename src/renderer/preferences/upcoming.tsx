import * as React from 'react'

import { DialogContent } from '../dialog'
import { Row } from '../layout'
import { TextBox } from '../form'

interface IUpcomingPreferencesProps {
  readonly url: string

  readonly onUrlChanged: (url: string) => void
}

export class UpcomingPreferences extends React.Component<IUpcomingPreferencesProps, {}> {

  public render() {
    return (
      <DialogContent>
        <Row>
          <TextBox
            label="Google Spreadsheet Url"
            value={this.props.url}
            onValueChanged={this.props.onUrlChanged}
            autoFocus={true}
          />
        </Row>
      </DialogContent>
    )
  }
}