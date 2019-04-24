import * as React from 'react'

import { Dispatcher } from '../../lib/dispatcher'
import { PreferencesTab } from '../../lib/preferences'
import { Dialog, DialogFooter } from '../dialog'
import { TabBar } from '../tab-bar'
import { Button, ButtonGroup } from '../button'
import { DarkSkyPreferences } from './dark-sky'
import { CountdownPreferences } from './countdown'
import { UpcomingPreferences } from './upcoming';

interface IPreferencesProps {
  readonly dispatcher: Dispatcher
  readonly preferences: any
  readonly onDismissed: () => void
}

interface IPreferencesState {
  readonly selectedIndex: PreferencesTab

  readonly darkSkyApiKey: string
  readonly darkSkyLatitude: number
  readonly darkSkyLongitude: number

  readonly countdownTitle: string
  readonly countdownDate: string
  readonly countdownTime: string

  readonly upcomingUrl: string
}

export class Preferences extends React.Component<
  IPreferencesProps,
  IPreferencesState
  > {
  public constructor(props: IPreferencesProps) {
    super(props)

    this.state = {
      selectedIndex: PreferencesTab.DarkSky,
      darkSkyApiKey: this.props.preferences.darksky.apiKey,
      darkSkyLatitude: this.props.preferences.darksky.latitude,
      darkSkyLongitude: this.props.preferences.darksky.longitude,
      countdownTitle: this.props.preferences.countdown.title,
      countdownDate: this.props.preferences.countdown.date,
      countdownTime: this.props.preferences.countdown.time,
      upcomingUrl: this.props.preferences.upcomingUrl
    }
  }

  private onSave = async () => {
    this.props.dispatcher.setPreferencesDarkSky(
      this.state.darkSkyApiKey,
      this.state.darkSkyLatitude,
      this.state.darkSkyLongitude
    )

    this.props.dispatcher.setPreferencesCountdown(
      this.state.countdownTitle,
      this.state.countdownDate,
      this.state.countdownTime
    )

    this.props.dispatcher.setPreferencesUpcoming(
      this.state.upcomingUrl
    )

    this.props.onDismissed()
  }

  public render() {
    return (
      <Dialog
        id="preferences"
        title="Preferences"
        onDismissed={this.props.onDismissed}
        onSubmit={this.onSave}
      >
        <TabBar
          onTabClicked={this.onTabClicked}
          selectedIndex={this.state.selectedIndex}
        >
          <span>Dark Sky</span>
          <span>RSS Feed</span>
          <span>Countdown</span>
          <span>Pingdom</span>
          <span>Upcoming</span>
          <span>BGG</span>
        </TabBar>
        {this.renderActiveTab()}
        <DialogFooter>
          {this.renderActiveButtons()}
        </DialogFooter>
      </Dialog>
    )
  }

  private renderActiveButtons() {
    return (
      <ButtonGroup>
        <Button type="submit">Save</Button>
        <Button onClick={this.props.onDismissed}>Cancel</Button>
      </ButtonGroup>
    )
  }

  private renderActiveTab() {
    const index = this.state.selectedIndex
    switch (index) {
      case PreferencesTab.DarkSky:
        return (
          <DarkSkyPreferences
            apiKey={this.state.darkSkyApiKey}
            latitude={String(this.state.darkSkyLatitude || '')}
            longitude={String(this.state.darkSkyLongitude || '')}
            onApiKeyChanged={this.onDarkSkyApiKeyChanged}
            onLatitudeChanged={this.onDarkSkyLatitudeChanged}
            onLongitudeChanged={this.onDarkSkyLongitudeChanged}
          />
        )
      case PreferencesTab.RSS:
        return (
          <div>RSS</div>
        )
      case PreferencesTab.Upcoming:
        return (
          <UpcomingPreferences
            url={this.state.upcomingUrl}
            onUrlChanged={this.onUpcomingUrlChanged}
          />
        )
      case PreferencesTab.Countdown:
        return (
          <CountdownPreferences
            title={this.state.countdownTitle}
            date={this.state.countdownDate}
            time={this.state.countdownTime}
            onTitleChanged={this.onCountdownTitleChanged}
            onDateChanged={this.onCountdownDateChanged}
            onTimeChanged={this.onCountdownTimeChanged}
          />
        )
      case PreferencesTab.Pingdom:
        return (
          <div>Pingdom</div>
        )
      case PreferencesTab.BoardGameGeek:
        return (
          <div>BGG</div>
        )
    }
  }

  private onTabClicked = (index: number) => {
    this.setState({ selectedIndex: index })
  }

  private onDarkSkyApiKeyChanged = (apiKey: string) => {
    this.setState({ darkSkyApiKey: apiKey })
  }

  private onDarkSkyLatitudeChanged = (latitude: string) => {
    this.setState({ darkSkyLatitude: Number(latitude) })
  }

  private onDarkSkyLongitudeChanged = (longitude: string) => {
    this.setState({ darkSkyLongitude: Number(longitude) })
  }

  private onCountdownTitleChanged = (title: string) => {
    this.setState({ countdownTitle: title })
  }

  private onCountdownDateChanged = (date: string) => {
    this.setState({ countdownDate: date })
  }

  private onCountdownTimeChanged = (time: string) => {
    this.setState({ countdownTime: time })
  }

  private onUpcomingUrlChanged = (url: string) => {
    this.setState({ upcomingUrl: url })
  }
}