import React from 'react'
import Spinner from 'react-spinkit'

import styles from './style'

export default () => (
  <div className={styles.wrapper}>
    <Spinner spinnerName="wave" />
  </div>
)
