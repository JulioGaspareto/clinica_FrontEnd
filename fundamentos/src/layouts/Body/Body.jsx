import React from 'react'
import Card from '../../components/Card/Card'

import styles from './Body.module.css'
import { CardApi } from '../../components/Card/CardApi'

const Body = () => {
  //array com nomes diferentes

  const usuarios = [
    {nome:"Ana", idade: 22, cidade:"São José"},
    {nome:"Bruno", idade: 30, cidade:"Florianópolis"},
    {nome:"João", idade: 35, cidade:"Palhoça"},
    {nome:"Ana", idade: 22, cidade:"São José"},
    {nome:"Bruno", idade: 30, cidade:"Florianópolis"},
    {nome:"João", idade: 35, cidade:"Palhoça"},
    {nome:"Ana", idade: 22, cidade:"São José"},
    {nome:"Bruno", idade: 30, cidade:"Florianópolis"},
    {nome:"João", idade: 35, cidade:"Palhoça"},
  ]

  return (
    <>
       <main className={styles.body}>
            <h2>Usuários Cadastrados</h2>
            <div className={styles.cardContainer}>
                {usuarios.map((usuario, index) => (
                    <Card
                        key={index}
                        nome={usuario.nome}
                        idade={usuario.idade}
                        cidade={usuario.cidade}
                    />
                ))}
            </div>

            <h3>Usuários vindos da API</h3>
            <CardApi/>
       </main>
    </>
  )
}

export default Body