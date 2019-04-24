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
          <WeatherWidget />
          <CalendarWidget
            datetime={state.datetime}
          />
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