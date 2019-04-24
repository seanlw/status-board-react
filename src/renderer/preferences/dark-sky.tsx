import * as React from 'react'

import { DialogContent } from '../dialog'
import { Row } from '../layout'
import { TextBox } from '../form'

interface IDarkSkyPreferencesProps {
  readonly apiKey: string
  readonly latitude: string
  readonly longitude: string

  readonly onApiKeyChanged: (apiKey: string) => void
  readonly onLatitudeChanged: (latitude: string) => void
  readonly onLongitudeChanged: (longitude: string) => void
}

export class DarkSkyPreferences extends React.Component<IDarkSkyPreferencesProps, {}> {

  public render() {
    return (
      <DialogContent>
        <Row>
          <TextBox
            label="API Key"
            value={this.props.apiKey}
            onValueChanged={this.props.onApiKeyChanged}
            autoFocus={true}
          />
        </Row>
        <Row>
          <TextBox
            label="Latitude"
            value={this.props.latitude}
            onValueChanged={this.props.onLatitudeChanged}
          />
        </Row>
        <Row>
          <TextBox
            label="Longitude"
            value={this.props.longitude}
            onValueChanged={this.props.onLongitudeChanged}
          />
        </Row>
      </DialogContent>
    )
  }
}