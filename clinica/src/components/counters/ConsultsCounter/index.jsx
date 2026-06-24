import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaCalendarCheck } from 'react-icons/fa'

const ConsultsCounter = () => {
    const [consultCounter, setConsultCounter] = useState(0)

    useEffect(() => {
        const fetchConsults = async () => {
            try {
                const response = await axios.get('http://localhost:3000/consults')
                setConsultCounter(response.data.length)
            } catch (error) {
                console.error("Erro ao obter dados do pacientes", error)
            }
        }
        fetchConsults()
    }, [])

    return (
        <div className='bg-white shadow rounded-lg p-6 flex flex-col items-center w-60'>
            <h2 className='text-xl font-bold flex items-center gap-2'>
                <FaCalendarCheck className='text-blue-600' />{consultCounter}
            </h2>
            <p className='text-gray-600 mt-2'>Consultas</p>
        </div>
    )
}

export default ConsultsCounter