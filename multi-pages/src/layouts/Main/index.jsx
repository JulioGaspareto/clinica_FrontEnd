import React from 'react'
import { Header } from '../Header'
import { Footer } from '../Footer'
import { Outlet } from 'react-router'

export const Main = () => {
  return (
   <div className='flex min-h-screen flex-col'>
        <Header/>
            <main className='flex-1 container mx-auto'>
                <Outlet/>
            </main>

        <Footer/>
   </div>
  )
}
