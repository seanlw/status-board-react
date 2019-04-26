import * as React from 'react';
import { Panel } from '../panel';
import { generate, ChartAPI } from 'c3'

import { PanelSizeType } from '../../lib/app-state'
import { IBoardGameGeekPlay } from '../../lib/stores';

const playMonthsAgo = 2

interface IBoardGameGeekPlaysWidgetProps {
  readonly plays: ReadonlyArray<IBoardGameGeekPlay>
}

interface IBoardGameGeekPlaysWidgetState {
  readonly playCount: IBoardGameGeekPlayCount
}

interface IBoardGameGeekPlayCount {
  [date: string]: number
}

export class BoardGameGeekPlaysWidget extends React.Component<IBoardGameGeekPlaysWidgetProps, IBoardGameGeekPlaysWidgetState> {

  public constructor(props: IBoardGameGeekPlaysWidgetProps) {
    super(props)

    this.state = {
      playCount: this.dayCounts(props.plays)
    }
  }

  public componentWillReceiveProps(nextProps: IBoardGameGeekPlaysWidgetProps) {
    this.setState({ playCount: this.dayCounts(nextProps.plays) })
  }

  private dayCounts(plays: ReadonlyArray<IBoardGameGeekPlay>): IBoardGameGeekPlayCount {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const ago = new Date()
    ago.setHours(0, 0, 0, 0)
    ago.setMonth(ago.getMonth() - playMonthsAgo)

    let counts: IBoardGameGeekPlayCount = {}
    plays.map((play) => {
      if (play.timestamp >= ago.getTime()) {
        if (play.date in counts) {
          counts[play.date] += 1
        }
        else {
          counts[play.date] = 1
        }
      }
    })

    for (let d = ago; d <= now; d.setDate(d.getDate() + 1)) {
      const date = this.formatDate(d)
      if (!(date in counts)) {
        counts[date] = 0
      }
    }

    return counts
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`
  }

  public render() {
    const currentState = this.state
    const keys: ReadonlyArray<string> = Object.keys(currentState.playCount).sort()
    let x = ['x']
    let y = ['plays']

    keys.map((key: string) => {
      x.push(key)
      y.push(String(currentState.playCount[key]))
    })

    return (
      <Panel
        size={PanelSizeType.Size3x1}
        title='Board Game Plays'
      >
        <PlayGraph
          data={[x, y]}
        />
      </Panel>
    )
  }
}

interface IPlayGraphProps {
  readonly data: string[][]
}

interface IPlayGraphState {
  readonly data: string[][]
}

class PlayGraph extends React.Component<IPlayGraphProps, IPlayGraphState> {
  private graph: ChartAPI | null = null

  public componentDidMount() {
    this.graph = this.createGraph(this.props.data)
    this.setState({ data: this.props.data })
  }

  public componentWillReceiveProps(nextProps: IPlayGraphProps) {
    if (this.graph && !this.compare(nextProps.data, this.state.data)) {
      this.graph = this.createGraph(nextProps.data)
      this.setState({ data: nextProps.data })
    }
  }

  public render() {
    return (
      <div
        id="boardgames-chart"
        className="bgg-plays"
      ></div>
    )
  }

  private createGraph(data: any): ChartAPI {
    const miny = Math.min(...data[1].slice(1));
    const maxy = Math.max(...data[1].slice(1));
    let yvalues = [];
    for (var i = miny; i <= maxy; i++) {
      yvalues.push(i);
    }

    return generate({
      bindto: '#boardgames-chart',
      padding: {
        left: 20,
        right: 15,
        top: 10
      },
      data: {
        x: 'x',
        columns: data,
        type: 'area'
      },
      grid: {
        y: {
          show: true
        }
      },
      legend: {
        show: false
      },
      tooltip: {
        show: false
      },
      point: {
        show: false
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%b %e'
          },
          padding: {
            left: 0,
            right: 0
          }
        },
        y: {
          tick: {
            count: 4,
            values: yvalues
          },
          min: 0,
          padding: {
            bottom: 0,
            top: 0
          }
        }
      },
      size: {
        width: 768,
        height: 188
      }
    })
  }

  private compare(array1: any, array2: any) {
    if (!array2) {
      return false;
    }
    if (array1.length !== array2.length) {
      return false;
    }
    for (var i = 0, l = array1.length; i < l; i++) {
      if (array1[i] instanceof Array && array2[i] instanceof Array) {
        if (!this.compare(array1[i], array2[i])) {
          return false;
        }
      }
      else if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }


}