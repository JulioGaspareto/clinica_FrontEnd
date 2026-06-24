import React, { useEffect, useState } from 'react'

import styles from './Card.module.css'

export const CardApi = () => {

    // let contador = 0
    // const [contador, setContador] = useState(0)

    // const incrementaValor = ()=>{
    //     // contador++
    //     setContador(prev => prev +1)

    //     console.log("contador",contador)
    // }


    const [users,setUsers] = useState([])

    const [filtro, setFiltro] = useState('')
   

    useEffect(()=>{
        fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then((data) =>{
        // .then(data => setUsers(data))
        const filtrados = data.filter((user)=>(
            user.name.toLowerCase().includes(filtro.toLowerCase())
        ))
        setUsers(filtrados)
        })
       
       
    },[filtro])


  return (
    <>

        <input
            type='text'
            className={styles.input}
            placeholder='Filtrar por nome...'
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
        />
        <div className={styles.cardContainerApi}>
            {
                users.map((user)=>(
                    <div className={styles.card} key={user.id}>
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                        <p>{user.address.street}</p>
                    </div>
                ))
            }
        </div>


        {/* <p>{contador}</p>
        <button onClick={incrementaValor}>Add</button> */}
    </>
  )
}


