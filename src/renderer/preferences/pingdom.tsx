import * as React from 'react'

import { DialogContent } from '../dialog'
import { Row } from '../layout'
import { TextBox, Select } from '../form'
import { IServer } from '../../lib/preferences'
import { IPingdomHost } from '../../lib/stores'

interface IPingdomPreferencesProps {
  readonly apiKey: string
  readonly username: string
  readonly password: string
  readonly servers: ReadonlyArray<IServer>
  readonly availableHosts: ReadonlyArray<IPingdomHost>

  readonly onApiKeyChanged: (key: string) => void
  readonly onUsernameChanged: (username: string) => void
  readonly onPasswordChanged: (password: string) => void
  readonly onServersChanged: (servers: ReadonlyArray<IServer>) => void
  readonly onBlur?: () => void
}

interface IPingdomPreferencesState {
  readonly servers: ReadonlyArray<IServer>
}

export class PingdomPreferences extends React.Component<IPingdomPreferencesProps, IPingdomPreferencesState> {

  public constructor(props: IPingdomPreferencesProps) {
    super(props)

    this.state = {
      servers: this.props.servers
    }
  }

  private onServerChanged = (value: string, index: number) => {
    const newServers = this.state.servers.length !== 5
      ? Array(5).fill({ id: '' }) : Array.from(this.state.servers)
    newServers[index] = { id: value }
    this.props.onServersChanged(newServers)
    this.setState({ servers: newServers })
  }

  private renderServers() {
    const servers = this.state.servers.length !== 5
      ? Array(5).fill({ id: '' }) : Array.from(this.state.servers)

    return servers.map((server: IServer, index: number) => {
      return (
        <ServerSelect
          key={index}
          index={index}
          value={server.id}
          options={this.props.availableHosts}
          onChange={this.onServerChanged}
        />
      )
    })
  }

  public render() {
    return (
      <DialogContent>
        <Row>
          <TextBox
            label="Api Key"
            value={this.props.apiKey}
            onValueChanged={this.props.onApiKeyChanged}
            autoFocus={true}
          />
        </Row>
        <Row>
          <TextBox
            label="Username"
            value={this.props.username}
            onValueChanged={this.props.onUsernameChanged}
            onBlur={this.props.onBlur}
          />
        </Row>
        <Row>
          <TextBox
            label="Password"
            type='password'
            value={this.props.password}
            onValueChanged={this.props.onPasswordChanged}
            onBlur={this.props.onBlur}
          />
        </Row>
        <Row
          className="pingdom-server-list"
        >
          <div className="server-title">Servers</div>
          {this.renderServers()}
        </Row>
      </DialogContent>
    )
  }
}

interface IServerSelectProps {
  readonly index: number
  readonly value: string
  readonly options: ReadonlyArray<IPingdomHost>

  readonly onChange?: (value: string, index: number) => void
}

interface IServerSelectState {
  readonly value: string
}

class ServerSelect extends React.Component<IServerSelectProps, IServerSelectState> {

  public constructor(props: IServerSelectProps) {
    super(props)

    this.state = { value: this.props.value }
  }

  private onChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value
    if (this.props.onChange) {
      this.props.onChange(value, this.props.index)
      this.setState({ value: value })
    }
  }

  public render() {
    const options = this.props.options || []

    return (
      <Select
        value={this.state.value}
        onChange={this.onChange}
      >
        <option key="o-none" value=""></option>
        {options.map((host: IPingdomHost, index: number) => {
          return (
            <option
              key={index}
              value={host.hostname}
            >
              {host.name}
            </option>
          )
        })}
      </Select>
    )
  }
} 