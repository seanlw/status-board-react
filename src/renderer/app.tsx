import * as React from 'react'
import { ipcRenderer } from 'electron'
import { Dispatcher } from '../lib/dispatcher'
import { AppStore } from '../lib/stores'
import {
  IAppState,
  PopupType
} from '../lib/app-state'

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
import { Preferences } from './preferences'
import { CSSTransitionGroup } from 'react-transition-group'

export const dialogTransitionEnterTimeout = 250
export const dialogTransitionLeaveTimeout = 100

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
      case 'show-preferences':
        return this.props.dispatcher.showPopup({ type: PopupType.Preferences })
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
          <WeatherWidget
            forcast={state.forcast}
            city={state.preferences.darksky.city}
            state={state.preferences.darksky.state}
          />
          <CalendarWidget
            datetime={state.datetime}
          />
        </Row>
        <Row>
          <RSSWidget
            items={state.rssItems}
          />
          <CountdownWidget
            datetime={state.datetime}
            title={state.preferences.countdown.title}
            date={state.preferences.countdown.date}
            time={state.preferences.countdown.time}
          />
        </Row>
        <Row>
          <PingdomWidget
            hosts={state.hosts}
            servers={state.preferences.pingdom.servers}
          />
          <UpcomingWidget
            events={state.events}
          />
        </Row>
        <Row>
          <BoardGameGeekPlaysWidget
            plays={state.plays}
          />
        </Row>
      </div>
    )
  }

  private renderPopup() {
    return (
      <CSSTransitionGroup
        transitionName="modal"
        component="div"
        transitionEnterTimeout={dialogTransitionEnterTimeout}
        transitionLeaveTimeout={dialogTransitionLeaveTimeout}
      >
        {this.popupContent()}
      </CSSTransitionGroup>
    )
  }

  private popupContent(): JSX.Element | null {
    const popup = this.state.currentPopup

    if (!popup) {
      return null
    }

    switch (popup.type) {
      case PopupType.Preferences:
        return (
          <Preferences
            dispatcher={this.props.dispatcher}
            preferences={this.state.preferences}
            availablePingdomHosts={this.state.availablePingdomHosts}
            onDismissed={this.onPopupDismissed}
          />
        )
    }

    return null
  }

  private onPopupDismissed = () => this.props.dispatcher.closePopup()

  public render() {

    return (
      <div id="app-container">
        <MoveHandle />
        {this.renderWidgets()}
        {this.renderPopup()}
      </div>
    )
  }
}