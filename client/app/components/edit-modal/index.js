import { map } from 'lodash'
import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'

import ProgressBar from '../progress-bar'
import base from '../../lib/base'
import * as progress from '../../lib/progress'

export default class EditModal extends Component {

  static displayName = 'EditModal';

  static propTypes = {
    dismiss: PropTypes.func.isRequired,
    game: PropTypes.string.isRequired,
    levels: PropTypes.object.isRequired,
    player: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.bindRef(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { game, player } = this.props
    if (nextProps.game !== game || nextProps.player !== player) {
      base.removeBinding(this.editableRef)
      this.bindRef(nextProps)
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.editableRef)
  }

  bindRef({ game, player }) {
    this.editableRef = base.syncState(`data/${player}/${game}`, {
      context: this,
      state: 'editable',
    })
  }

  update(level, val) {
    this.state.editable[level] = val
    this.setState({ editable: this.state.editable })
  }

  render() {
    const { dismiss, game, levels, player } = this.props
    const { editable } = this.state
    if (!editable) return null
    return (
      <Modal className="modal-dialog" isOpen onRequestClose={dismiss}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>{game} for {player}</h3>
          </div>
          <div className="modal-body">
            {map(levels, level => (
              <div key={level}>
                <label>
                  <input
                    checked={editable[level]}
                    onChange={e => this.update(level, e.target.checked)}
                    type="checkbox"
                  />
                  <span> {level}</span>
                </label>
              </div>
            ))}
            <ProgressBar
              value={progress.forGame(editable, levels)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn" onClick={dismiss}>Close</button>
          </div>
        </div>
      </Modal>
    )
  }
}
