import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

//modal

import Modal from '../Modal'



function ConsultationForm() {
    const [searchTerm, setSearchTerm] = useState("")
    const [patients, setPatients] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        reason: "",
        date: "",
        time: "",
        description: "",
        medication: "",
        dosagePrecautions: "",
    })


    // busca pacientes

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://localhost:3000/patients")
                setPatients(response.data)
            } catch (error) {
                console.error("Erro ao obter dados dos pacientes", error)
            }
        }
        fetchPatients()
    }, [])


    // funções auxiliares

    //controle do campo de filtro

    const handleSearchChange = (e) => setSearchTerm(e.target.value)

    //filtro dos pacientes

    const filteredPatients = patients.filter(
        (patient) =>
            patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toString().includes(searchTerm)
    )

    //seleciona o paciente  e abre modal

    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient)
        setIsModalOpen(true)
    }

    //fecha modal e reseta o valor do paciente selecionado

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedPatient(null)
    }

    //Controla os campos do estado formData dinamicamente

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    //reseta o form

    const resetForm = () => {
        setFormData({
            reason: "",
            date: "",
            time: "",
            description: "",
            medication: "",
            dosagePrecautions: "",
        })
    }

    //envia os dados

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedPatient) return

        try {
            setIsSaving(true)

            const dataToSave = {
                patientId: selectedPatient.id,
                ...formData
            }

            await axios.post("http://localhost:3000/consults", dataToSave)

            toast.success("Consulta cadastrada com sucesso!", {
                autoClose: 2000,
                hideProgressBar: true
            })

            resetForm()
            handleCloseModal()

        } catch (error) {
            console.error("Erro ao cadastrar consulta!")
            toast.error("Erro ao cadastrar consulta!", {
                autoClose: 2000,
                hideProgressBar: true
            })
        }
    }



    return (
        <section className='p-6 text-gray-800'>
            {/* campo de busca */}

            <div className='mb-6'>
                <label className='block text-sm font-semibold mb-2'>
                    Buscar paciente para cadastrar a consulta
                </label>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder='Digite o nome ou o registro do paciente'
                    className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                />

            </div>

            {/* Lista de pacientes */}

            <ul className='space-y-3'>
                {
                    filteredPatients.map((patient) => (
                        <li
                            key={patient.id}
                            className='p-4 border rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50 transition'
                        >
                            <div>
                                <p className='text-sm'>
                                    <strong>Registro:</strong> {patient.id}
                                </p>
                                <p className='text-sm'>
                                    <strong>Nome:</strong> {patient.fullName}
                                </p>

                                <p className='text-sm'>
                                    <strong>Convênio:</strong> {patient.healthInsurance}
                                </p>

                            </div>

                            <button
                                onClick={() => handleSelectPatient(patient)}
                                className='bg-cyan-700 text-white px-3 py-2 rounded-lg hover:bg-cyan-600 cursor-pointer'
                            >
                                Selecionar
                            </button>

                        </li>
                    ))
                }
            </ul>


            {/* Modal de cadastro de consulta */}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {
                    selectedPatient && (
                        <>
                            {/* Título */}
                            <h2 className='text-lg font-bold mb-4 text-cyan-700'>
                                Cadastrar consulta para {selectedPatient.fullName}
                            </h2>

                            {/* Dados básicos */}
                            <div className='mb-4 text-sm text-gray-700'>
                                <p>
                                    <strong>Email:</strong> {selectedPatient.email}
                                </p>
                                <p>
                                    <strong>Telefone:</strong> {selectedPatient.phone}
                                </p>
                            </div>

                            {/* Formulário */}

                            <form onSubmit={handleSubmit} className='space-y-4'>
                                {/* motivo da consulta */}
                                <div>
                                    <label htmlFor='reason' className='block text-sm font-medium mb-1'>
                                        Motivo da Consulta
                                    </label>

                                    <input
                                        type='text'
                                        name='reason'
                                        id='reason'
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                        required
                                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                                    />
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                    {/* data */}
                                    <div>
                                        <label htmlFor='date' className='block text-sm font-medium mb-1'>
                                            Data
                                        </label>

                                        <input
                                            type='date'
                                            name='date'
                                            id='date'
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                            className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                                        />
                                    </div>
                                    {/* Hora */}
                                    <div>
                                        <label htmlFor='time' className='block text-sm font-medium mb-1'>
                                            Horário
                                        </label>

                                        <input
                                            type='time'
                                            name='time'
                                            id='time'
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            required
                                            className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                                        />
                                    </div>

                                </div> {/* fechamento do grid*/}

                                {/* Descrição do problema */}

                                <div>
                                    <label htmlFor='description' className='block text-sm font-medium mb-1'>
                                        Descrição do problema
                                    </label>

                                    <textarea
                                        name='description'
                                        id='description'
                                        value={formData.description}
                                        rows={3}
                                        onChange={handleInputChange}
                                        required
                                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none resize-none'
                                    />
                                </div>

                                {/* Medicação receitada */}

                                <div>
                                    <label htmlFor='medication' className='block text-sm font-medium mb-1'>
                                        Medicação receitada
                                    </label>

                                    <input
                                        type='text'
                                        name='medication'
                                        id='medication'
                                        value={formData.medication}
                                        onChange={handleInputChange}
                                        required
                                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                                    />
                                </div>


                                {/* Dosagem e Precauções */}

                                <div>
                                    <label htmlFor='dosagePrecautions' className='block text-sm font-medium mb-1'>
                                        Dosagem e Precauções
                                    </label>

                                    <input
                                        type='text'
                                        name='dosagePrecautions'
                                        id='dosagePrecautions'
                                        value={formData.dosagePrecautions}
                                        onChange={handleInputChange}
                                        required
                                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                                    />
                                </div>

                                {/* botões */}

                                <div className='flex justify-end gap-3 pt-4'>
                                    <button
                                        type='button'
                                        onClick={handleCloseModal}
                                        className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition'
                                    >
                                        Fechar
                                    </button>


                                    <button
                                        type='submit'
                                        disabled={isSaving}
                                        className='px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 transition'
                                    >
                                        {isSaving ? "Salvando..." : "Salvar"}
                                    </button>


                                </div>



                            </form>
                        </>
                    )
                }
            </Modal>

        </section>
    )
}

export default ConsultationForm