import React from 'react'

import styles from "./Footer.module.css"

export const Footer = ({autor}) => {
  return (
    <footer className={styles.footer}>
        <p>Desenvolvido por {autor}</p>
    </footer>
  )
}
