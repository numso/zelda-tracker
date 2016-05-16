import { get, map, range, size } from 'lodash'
import React, { Component } from 'react'

import EditModal from './components/edit-modal'
import Loading from './components/loading'
import ProgressBar from './components/progress-bar'
import base from './lib/base'
import * as progress from './lib/progress'
import styles from './style'

function bind(context, state) {
  return base.bindToState(state, { context, state })
}

export default class Main extends Component {

  constructor(props) {
    super(props)
    this.state = { showModal: false }
  }

  componentDidMount() {
    this.gamesRef = bind(this, 'games')
    this.peopleRef = bind(this, 'people')
    this.dataRef = bind(this, 'data')
  }

  componentWillUnmount() {
    base.removeBinding(this.gamesRef)
    base.removeBinding(this.peopleRef)
    base.removeBinding(this.dataRef)
  }

  openModal(game, levels, player) {
    this.setState({
      showModal: true,
      selected: { game, levels, player },
    })
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  render() {
    const { data, games, people, showModal, selected } = this.state
    if (!games || !people) {
      return <Loading />
    }
    return (
      <div>
        <h3 className="center">Zelda Tracker</h3>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              {map(people, person => <th key={person}>{person}</th>)}
            </tr>
          </thead>
          <tbody>
            {map(games, (levels, game) => (
              <tr key={game}>
                <td>{game}</td>
                {map(people, person => {
                  const p = get(data, `${person}.${game}`)
                  return (
                    <td key={person}>
                      <ProgressBar
                        value={progress.forGame(p, levels)}
                        onClick={() => this.openModal(game, levels, person)}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
            <tr className={styles.spacer}>
              {map(range(size(people) + 1), p => <td key={p}/>)}
            </tr>
            <tr>
              <td>Totals: (dungeons)</td>
              {map(people, person => (
                <td key={person}>
                  <ProgressBar
                    type="success"
                    value={progress.byDungeons(get(data, person), games)}
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td>Totals: (games)</td>
              {map(people, person => (
                <td key={person}>
                  <ProgressBar
                    type="success"
                    value={progress.byGames(get(data, person), games)}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        {showModal && (
          <EditModal
            dismiss={this.closeModal}
            game={selected.game}
            levels={selected.levels}
            player={selected.player}
          />
        )}
      </div>
    )
  }
}
