import cx from 'classnames'
import React, { PropTypes } from 'react'

import styles from './style'

export default function ProgressBar({ onClick, type, value }) {
  const otherClass = type && ` progress-bar-${type}`
  return (
    <div onClick={onClick} className={cx('progress', styles.wrapper)}>
      <div
        className={cx('progress-bar', otherClass)}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax="100"
        style={{ width: `${value}%` }}
      />
      <div className={styles.text}>{value}%</div>
    </div>
  )
}

ProgressBar.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.number,
}
