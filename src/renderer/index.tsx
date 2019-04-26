/// <reference path="../lib/globals.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app';
import { Dispatcher } from '../lib/dispatcher'
import {
  AppStore,
  DarkSkyStore,
  UpcomingStore,
  BoardGameGeekStore
} from '../lib/stores'

import '../styles/desktop.scss'

const darkSkyStore = new DarkSkyStore()
const upcomingStore = new UpcomingStore()
const boardGameGeekStore = new BoardGameGeekStore()

const appStore = new AppStore(darkSkyStore, upcomingStore, boardGameGeekStore)
const dispatcher = new Dispatcher(appStore)

ReactDOM.render(
  <App dispatcher={dispatcher} appStore={appStore} />,
  document.getElementById("app")
)
