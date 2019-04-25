/// <reference path="../lib/globals.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app';
import { Dispatcher } from '../lib/dispatcher'
import {
  AppStore,
  DarkSkyStore,
  UpcomingStore
} from '../lib/stores'

import '../styles/desktop.scss'

const darkSkyStore = new DarkSkyStore()
const upcomingStore = new UpcomingStore()

const appStore = new AppStore(darkSkyStore, upcomingStore)
const dispatcher = new Dispatcher(appStore)

ReactDOM.render(
  <App dispatcher={dispatcher} appStore={appStore} />,
  document.getElementById("app")
)
