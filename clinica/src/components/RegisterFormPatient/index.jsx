import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

import { IMaskInput } from 'react-imask';

function RegisterFormPatient() {
    const [formData, setFormData] = useState({
        fullName: "",
        gender: "",
        birthdate: "",
        cpf: "",
        rg: "",
        maritalStatus: "",
        phone: "",
        email: "",
        birthplace: "",
        emergencyContact: "",
        allergies: "",
        specialCare: "",
        healthInsurance: "",
        insuranceNumber: "",
        insuranceValidity: "",
        address: {
            cep: "",
            city: "",
            state: "",
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
            reference: ""
        }
    })

    const [isSaving, setIsSaving] = useState(false)

    // handles

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value })) //operador spread e propriedade computada
    }

    const handleAddressChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        })) //operador spread e propriedade computada
    }

    // requisição para api viacep 

    const fetchAddressData = async (cep) => {
        try {
            const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json`)
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    cep: data.cep || "",
                    city: data.localidade || "",
                    state: data.uf || "",
                    street: data.logradouro || "",
                    complement: data.complemento || "",
                    neighborhood: data.bairro || ""
                }
            }))

        } catch (error) {
            console.log("Erro ao buscar endereço", error)
        }
    }

    // tratamento do valor digitado no campo de cep

    const handleCepBlur = (e) => {
        const cep = e.target.value.replace(/\D/g, "")
        if (cep.length === 8) fetchAddressData(cep)

    }


    //validação da data de nascimento

    const yesterday = new Date() // retorna nesse exemplo => Mon Jun 15 2026 14:30:00 GMT-0300
    yesterday.setDate(yesterday.getDate() - 1) // retorna o dia atual menos um (ontem)

    //toISOString retorna uma string no formato 2026-06-14T17:30:00.000Z
    /*
    2026-06-14 → data
    T → separador
    17:30:00.000Z → horário UTC
    */

    /*
    .split("T")[0]
    separa a string no caractere T
    E pega a primeira parte do do índice devolvido, no caso "2026-06-14"

    <input
        type="date"
        max="2026-06-14"
    />

    */


    const maxBirthDate = yesterday.toISOString().split("T")[0]




    const validadeDate = () => {
        const selectedDate = new Date(formData.birthdate)

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (selectedDate >= today) {
            toast.error("A data de nascimento deve ser anterior à data atual.", {
                autoClose: 2000,
                hideProgressBar: true
            })
            return
        }
    }

    //submit form

    const handleSubmit = async (e) => {
        e.preventDefault()


        const selectedDate = new Date(formData.birthdate)

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (selectedDate >= today) {
            toast.error("A data de nascimento deve ser anterior à data atual.", {
                autoClose: 2000,
                hideProgressBar: true
            })
            return
        }



        setIsSaving(true)

        try {
            await axios.post("http://localhost:3000/patients", formData)

            toast.success("Paciente cadastrado com sucesso!", {
                autoClose: 2000,
                hideProgressBar: true
            })

            setFormData({
                fullName: "",
                gender: "",
                birthdate: "",
                cpf: "",
                rg: "",
                maritalStatus: "",
                phone: "",
                email: "",
                birthplace: "",
                emergencyContact: "",
                allergies: "",
                specialCare: "",
                healthInsurance: "",
                insuranceNumber: "",
                insuranceValidity: "",
                address: {
                    cep: "",
                    city: "",
                    state: "",
                    street: "",
                    number: "",
                    complement: "",
                    neighborhood: "",
                    reference: ""
                }
            })

        } catch (error) {
            console.error(error)
            toast.error("Erro ao Salvar os dados!", {
                autoClose: 2000,
                hideProgressBar: true
            })
        }
    }


    return (
        <form
            onSubmit={handleSubmit}
            className='space-y-6 text-gray-800'
            autoComplete='off'
        >

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Nome completo */}
                <fieldset>
                    <label htmlFor='fullName' className='block text-sm font-medium mb-1'>Nome Completo</label>
                    <input
                        type='text'
                        name='fullName'
                        id='fullName'
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

                {/* gênero */}

                <fieldset>

                    <label htmlFor='gender' className='block text-sm font-medium mb-1'>Gênero</label>

                    <select
                        name='gender'
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    >
                        <option value="">Selecione</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>

                    </select>

                </fieldset>


                {/* Data de nascimento */}
                <fieldset>
                    <label htmlFor='birthdate' className='block text-sm font-medium mb-1'>Data de Nascimento</label>
                    <input
                        type='date'
                        name='birthdate'
                        id='birthdate'
                        value={formData.birthdate}
                        onChange={handleInputChange}
                        onBlur={validadeDate}
                        max={maxBirthDate}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* CPF */}
                <fieldset>
                    <label htmlFor='cpf' className='block text-sm font-medium mb-1'>CPF</label>
                    <IMaskInput
                        mask="000.000.000-00"
                        name='cpf'
                        minLength={14}
                        id='cpf'
                        value={formData.cpf}
                        onAccept={(value) => setFormData((prev) => ({ ...prev, cpf: value }))}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* RG */}
                <fieldset>
                    <label htmlFor='rg' className='block text-sm font-medium mb-1'>RG:</label>
                    <input
                        type='text'
                        name='rg'
                        id='rg'
                        value={formData.rg}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* Estado Civil */}

                <fieldset>

                    <label htmlFor='maritalStatus' className='block text-sm font-medium mb-1'>Estado Civil</label>

                    <select
                        name='maritalStatus'
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    >
                        <option value="">Selecione</option>
                        <option value="solteiro(a)">Solteiro(a)</option>
                        <option value="casado(a)">Casado(a)</option>
                        <option value="divorciado(a)">Divorciado(a)</option>
                        <option value="viuvo(a)">Viúvo(a)</option>

                    </select>

                </fieldset>


                {/* telefone */}
                <fieldset>
                    <label htmlFor='phone' className='block text-sm font-medium mb-1'>Telefone</label>
                    <IMaskInput
                        mask="(00) 00000-0000"
                        name='phone'
                        id='phone'
                        value={formData.phone}
                        onAccept={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* contato de emergência */}
                <fieldset>
                    <label htmlFor='emergencyContact' className='block text-sm font-medium mb-1'>Contato de Emergência</label>
                    <IMaskInput
                        mask="(00) 00000-0000"
                        name='emergencyContact'
                        id='emergencyContact'
                        value={formData.emergencyContact}
                        onAccept={(value) => setFormData((prev) => ({ ...prev, emergencyContact: value }))}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* Email */}
                <fieldset>
                    <label htmlFor='email' className='block text-sm font-medium mb-1'>Email:</label>
                    <input
                        type='email'
                        name='email'
                        id='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* Naturalidade */}
                <fieldset>
                    <label htmlFor='birthplace' className='block text-sm font-medium mb-1'>Naturalidade:</label>
                    <input
                        type='text'
                        name='birthplace'
                        id='birthplace'
                        value={formData.birthplace}
                        onChange={handleInputChange}
                        required
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* Alergias */}
                <fieldset>
                    <label htmlFor='allergies' className='block text-sm font-medium mb-1'>Alergias?</label>
                    <input
                        type='text'
                        name='allergies'
                        id='allergies'
                        value={formData.allergies}
                        onChange={handleInputChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* Cuidados especiais */}
                <fieldset>
                    <label htmlFor='specialCare' className='block text-sm font-medium mb-1'>Cuidados Especiais?</label>
                    <input
                        type='text'
                        name='specialCare'
                        id='specialCare'
                        value={formData.specialCare}
                        onChange={handleInputChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* Convênio */}
                <fieldset>
                    <label htmlFor='healthInsurance' className='block text-sm font-medium mb-1'>Convênio</label>
                    <input
                        type='text'
                        name='healthInsurance'
                        id='healthInsurance'
                        value={formData.healthInsurance}
                        onChange={handleInputChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* Número do Convênio */}
                <fieldset>
                    <label htmlFor='insuranceNumber' className='block text-sm font-medium mb-1'>Número do Convênio</label>
                    <input
                        type='text'
                        name='insuranceNumber'
                        id='insuranceNumber'
                        value={formData.insuranceNumber}
                        onChange={handleInputChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* Validade do Convênio */}
                <fieldset>
                    <label htmlFor='insuranceValidity' className='block text-sm font-medium mb-1'>Validade do Convênio</label>
                    <input
                        type='date'
                        name='insuranceValidity'
                        id='insuranceValidity'
                        value={formData.insuranceValidity}
                        onChange={handleInputChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* CEP */}
                <fieldset>
                    <label htmlFor='cep' className='block text-sm font-medium mb-1'>CEP</label>
                    <IMaskInput
                        mask="00000-000"
                        name='cep'
                        id='cep'
                        value={formData.address.cep}
                        onBlur={handleCepBlur}
                        onAccept={(value) => handleAddressChange({ target: { name: "cep", value } })}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* Rua */}
                <fieldset>
                    <label htmlFor='street' className='block text-sm font-medium mb-1'>Rua</label>
                    <input
                        type='text'
                        name='street'
                        id='street'
                        value={formData.address.street}
                        onChange={handleAddressChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* Número */}
                <fieldset>
                    <label htmlFor='number' className='block text-sm font-medium mb-1'>Número</label>
                    <input
                        type='text'
                        name='number'
                        id='number'
                        value={formData.address.number}
                        onChange={handleAddressChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* Complemento */}
                <fieldset>
                    <label htmlFor='complement' className='block text-sm font-medium mb-1'>Complemento</label>
                    <input
                        type='text'
                        name='complement'
                        id='complement'
                        value={formData.address.complement}
                        onChange={handleAddressChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>



                {/* Referência */}
                <fieldset>
                    <label htmlFor='reference' className='block text-sm font-medium mb-1'>Referência</label>
                    <input
                        type='text'
                        name='reference'
                        id='reference'
                        value={formData.address.reference}
                        onChange={handleAddressChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* Bairro */}
                <fieldset>
                    <label htmlFor='neighborhood' className='block text-sm font-medium mb-1'>Bairro</label>
                    <input
                        type='text'
                        name='neighborhood'
                        id='neighborhood'
                        value={formData.address.neighborhood}
                        onChange={handleAddressChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

                {/* Cidade */}
                <fieldset>
                    <label htmlFor='city' className='block text-sm font-medium mb-1'>Cidade</label>
                    <input
                        type='text'
                        name='city'
                        id='city'
                        value={formData.address.city}
                        onChange={handleAddressChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>


                {/* Estado */}
                <fieldset>
                    <label htmlFor='state' className='block text-sm font-medium mb-1'>Estado</label>
                    <input
                        type='text'
                        name='state'
                        id='state'
                        value={formData.address.state}
                        onChange={handleAddressChange}
                        className='w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none'
                    />
                </fieldset>

            </div >

            {/* botão de envio */}

            < div className='flex justify-end gap-3 pt-4' >
                <button
                    type='submit'
                    disabled={isSaving}
                    className='px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50'
                >
                    {isSaving ? "Salvando..." : "Salvar"}

                </button>
            </div >


        </form >
    )
}

export default RegisterFormPatient