import * as React from 'react';
import { Panel } from '../panel';
import { PanelSizeType } from '../../lib/app-state'
import { IPingdomCheck, IPingdomHost } from '../../lib/stores'
import { IServer } from '../../lib/preferences'
import * as classNames from 'classnames'

interface IPingdomWidgetProps {
  readonly hosts: IPingdomCheck | null
  readonly servers: ReadonlyArray<IServer>
}

export class PingdomWidget extends React.Component<IPingdomWidgetProps, {}> {

  public renderServers() {
    if (!this.props.hosts || this.props.servers.length === 0) {
      return
    }
    const hosts = this.props.hosts.checks

    return this.props.servers.map((server: IServer, index: number) => {
      return (
        <IPingdomServer
          hostname={server.id}
          hosts={hosts}
        />
      )
    })
  }

  public render() {
    return (
      <Panel
        size={PanelSizeType.Size2x1}
        title='Servers'
      >
        {this.renderServers()}
      </Panel>
    )
  }
}

interface IPingdomServerProps {
  readonly hostname: string
  readonly hosts: ReadonlyArray<IPingdomHost>
}

class IPingdomServer extends React.Component<IPingdomServerProps, {}> {
  public render() {
    const host: IPingdomHost | undefined = this.props.hosts.find((host: IPingdomHost) => {
      return host.hostname === this.props.hostname
    })
    if (!host) {
      return
    }

    const statusClass = classNames('status', host.status)
    const lrtClass = classNames(
      'responsetime',
      this.lastreponsetimeClass(host.lastresponsetime)
    )

    return (
      <div className="pingdom-server">
        <span className={statusClass}></span>
        <h2>{host.name}</h2>
        <span className={lrtClass}>{host.lastresponsetime} ms</span>
      </div>
    )
  }

  private lastreponsetimeClass(time: number): string {
    if (time >= 1500 && time < 3000) {
      return 'warning';
    }
    if (time >= 3000) {
      return 'critical';
    }
    return ''
  }
}