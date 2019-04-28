# Status Board
A [Electron](https://electronjs.org/)-based application that displays a status board to display various pieces of information, much like [Panic's Status Board](https://panic.com/statusboard/). It is written in [TypeScript](https://www.typescriptlang.org/) and uses [React](https://reactjs.org/).

## Usage

### Weather

You need a API key from [Dark Sky](https://darksky.net) which is free but request [registration](https://darksky.net/dev/register). The free tier allows up to 1000 calls per day, Status Board updates every 10 minutes.

### Servers

You need a API key from [Pingdom](https://www.pingdom.com/) with your registration. Pindom is a paid subscription but offers a [14-day trial](https://www.pingdom.com/signup/). Status Board updates checks every 5 minutes.

### Upcoming

Upcoming events are generated from a Google Sheet you create. Data must be on the first worksheet and contain a `Date` and `Title` column. You must share with at least the `Anyone with a link can vew` policy. Status Board updates every 10 minutes.

### Board Game Plays

You need a [Board Game Geek](https://boardgamegeek.com) account to log your plays. It is recomended you use the application [Board Game Stats](https://www.bgstatsapp.com/) to log your plays with Board Game Geek.


## Develpment

The use of the [yarn](https://yarnpkg.com/) package manager is strongly recommended, as opposed to using `npm`.

```
# install dependencies
yarn

# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# create distribution package, `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```

The main process is at `src/main/index.ts` and the renderer process is at `src/renderer/index.tsx`

All compiled distributions are created in `release/`


### keytar

Status Board uses the [keytar](https://github.com/atom/node-keytar) node module to manage passwords. There are a few things to note while developing with this module.

#### On Linux

Currently this library uses `libsecret` so you may need to install it before running `yarn`.

Depending on your distribution, you will need to run the following command:

* Debian/Ubuntu: `sudo apt-get install libsecret-1-dev`
* Red Hat-based: `sudo yum install libsecret-devel`
* Arch Linux: `sudo pacman -S libsecret`

#### Electron

If you recieve an error message regarding a invalid node module version with keytar, you will need to rebuild Electron by running `./node_modules/.bin/electron-rebuild` 

## License

**[MIT](LICENSE)**