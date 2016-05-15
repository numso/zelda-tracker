import { map, reduce, size, startsWith } from 'lodash'
import Rebase from 're-base'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'

import './style'

const base = Rebase.createClass('https://zelda.firebaseio.com')

class Main extends Component {

  constructor(props) {
    super(props)
    this.state = {
      modal: {
        isOpen: false,
      },
    }
  }

  componentDidMount() {
    this.gamesRef = base.bindToState('games', {
      context: this,
      state: 'games',
    })
    this.peopleRef = base.bindToState('people', {
      context: this,
      state: 'people',
    })
    this.dataRef = base.bindToState('data', {
      context: this,
      state: 'data',
    })
  }

  componentWillUnmount() {
    base.removeBinding(this.gamesRef)
    base.removeBinding(this.peopleRef)
    base.removeBinding(this.dataRef)
    if (this.modal.isOpen) {
      base.removeBinding(this.editableRef)
    }
  }

  openModal(person, game, levels) {
    this.editableRef = base.syncState(`data/${person}/${game}`, {
      context: this,
      state: 'editable',
    })
    this.setState({
      modal: {
        isOpen: true,
        game,
        player: person,
        levels,
      },
    })
  }

  closeModal() {
    base.removeBinding(this.editableRef)
    this.setState({
      modal: {
        isOpen: false,
      },
    })
  }

  progressDungeons(person) {
    if (!this.state.data) return '--'
    const progress = this.state.data[person]
    const numFinish = reduce(progress, (memo, item, key) => {
      if (startsWith(key, '$')) return memo
      const num = reduce(item, (memo, item) => {
        if (!item) return memo
        return memo + 1
      }, 0)
      return memo + num
    }, 0)
    const numLevels = reduce(this.state.games, (memo, item, key) => {
      if (startsWith(key, '$')) return memo
      return memo + size(item)
    }, 0)
    return Math.round(numFinish / numLevels * 100)
  }

  progressGames(person) {
    if (!this.state.data) return '--'
    const progress = this.state.data[person]
    const numFinish = reduce(progress, (memo, item, key) => {
      if (startsWith(key, '$')) return memo
      const count = reduce(item, (memo2, item2) => {
        if (!item2) return memo2
        return memo2 + 1
      }, 0)
      if (count !== size(this.state.games[key])) return memo
      return memo + 1
    }, 0)
    const numGames = reduce(this.state.games, (memo, item, key) => {
      if (startsWith(key, '$')) return memo
      return memo + 1
    }, 0)
    return Math.round(numFinish / numGames * 100)
  }

  progress(person, name, levels) {
    if (!this.state.data || !person) return '--'
    const progress = this.state.data[person][name]
    const numFinish = reduce(progress, (memo, item, key) => {
      if (startsWith(key, '$')) return memo
      if (!item) return memo
      return memo + 1
    }, 0)
    const numLevels = size(levels)
    return Math.round(numFinish / numLevels * 100)
  }

  update(level, val) {
    this.state.editable[level] = val
    this.setState({
      editable: this.state.editable,
    })
  }

  render() {
    return (
      <div>
        <h3 className="center">Zelda Tracker</h3>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              {map(this.state.people, person => <th>{person}</th>)}
            </tr>
          </thead>
          <tbody>
            {map(this.state.games, (levels, name) => (
              <tr>
                <td>{name}</td>
                {map(this.state.people, person => (
                  <td>
                    <ProgressBar
                      value={this.progress(person, name, levels)}
                      onClick={() => this.openModal(person, name, levels)}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr><td></td>{map(this.state.people, () => <td></td>)}</tr>
            <tr><td></td>{map(this.state.people, () => <td></td>)}</tr>
            <tr>
              <td>Totals: (dungeons)</td>
              {map(this.state.people, person => (
                <td>
                  <ProgressBar type="success" value={this.progressDungeons(person)} />
                </td>
              ))}
            </tr>
            <tr>
              <td>Totals: (games)</td>
              {map(this.state.people, person => (
                <td>
                  <ProgressBar type="success" value={this.progressGames(person)} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <Modal isOpen={this.state.modal.isOpen} onRequestClose={() => this.closeModal()} className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{this.state.modal.game} for {this.state.modal.player}</h3>
            </div>
            <div className="modal-body">
              {map(this.state.modal.levels, level => (
                <div>
                  <label>
                    <input type="checkbox" checked={this.state.editable[level]} onChange={e => this.update(level, e.target.checked)} />
                    <span> {level}</span>
                  </label>
                </div>
              ))}
              <ProgressBar value={this.progress(this.state.modal.player, this.state.modal.game, this.state.modal.levels)} />
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => this.closeModal()}>Close</button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

class ProgressBar extends Component {
  render() {
    const { onClick, type, value } = this.props
    const otherClass = type ? ` progress-bar-${type}` : ''
    return (
      <div onClick={onClick}>
        <div className="progress" style={{ position: 'relative' }}>
          <div
            className={`progress-bar${otherClass}`}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: `${value}%` }}
          >
          </div>
          <div style={{ width: '100%', textAlign: 'center', position: 'absolute' }}>{value}%</div>
        </div>
      </div>
    )
  }
}

const el = document.getElementById('app')
ReactDOM.render(<Main />, el)
