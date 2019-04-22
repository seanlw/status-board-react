import * as React from 'react'
import { ipcRenderer } from 'electron'
import { Dispatcher } from '../lib/dispatcher'
import { AppStore } from '../lib/stores'
import { IAppState } from '../lib/app-state'

import { MenuEvent } from '../main/menu'
import { MoveHandle } from './window'
import {
  ClockWidget,
  WeatherWidget,
  CalendarWidget,
  RSSWidget,
  CountdownWidget,
  PingdomWidget,
  UpcomingWidget,
  BoardGameGeekPlaysWidget
} from './widgets'
import { Row } from './layout'

interface IAppProps {
  readonly appStore: AppStore
  readonly dispatcher: Dispatcher
}

export class App extends React.Component<IAppProps, IAppState> {

  public constructor(props: IAppProps) {
    super(props)

    props.dispatcher.loadInitialState()

    this.state = props.appStore.getState()
    props.appStore.onDidUpdate(state => {
      this.setState(state)
    })

    ipcRenderer.on(
      'menu-event',
      (event: Electron.IpcMessageEvent, { name }: { name: MenuEvent }) => {
        this.onMenuEvent(name)
      }
    )
  }

  private onMenuEvent(name: MenuEvent): any {
    switch (name) {

    }
  }

  private renderWidgets() {
    const state = this.state

    return (
      <div id="app-widgets">
        <Row>
          <ClockWidget
            datetime={state.datetime}
          />
          <WeatherWidget />
          <CalendarWidget />
        </Row>
        <Row>
          <RSSWidget />
          <CountdownWidget />
        </Row>
        <Row>
          <PingdomWidget />
          <UpcomingWidget />
        </Row>
        <Row>
          <BoardGameGeekPlaysWidget />
        </Row>
      </div>
    )
  }

  public render() {

    return (
      <div id="app-container">
        <MoveHandle />
        {this.renderWidgets()}
      </div>
    )
  }
}