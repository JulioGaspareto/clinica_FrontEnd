import { useState, useEffect } from "react"
import axios from "axios"
import { FaUserAlt } from 'react-icons/fa'
import { Link } from "react-router"

const PatientsList = () => {
    const [patients, setPatients] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [searchField, setSearchField] = useState("all") // campo selecionado no filtro
    const [ages, setAges] = useState({})

    const calculateAge = (birthdate) => {
        if (!birthdate) return "-"
        const today = new Date()
        const birthdateDate = new Date(birthdate)
        let age = today.getFullYear() - birthdateDate.getFullYear()
        const monthDiff = today.getMonth() - birthdateDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateDate.getDate())) {
            age--
        }
        return age
    }

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://localhost:3000/patients")
                if (!response) return

                const patientsData = response.data

                const calculatedAges = {}
                patientsData.forEach((patient) => {
                    calculatedAges[patient.id] = calculateAge(patient.birthdate)
                })
                setAges(calculatedAges)
                setPatients(patientsData)

            } catch (error) {
                console.error("Erro ao obter os dados de paciente", error)
            }
        }
        fetchPatients()
    }, [])

    // Decide em qual campo do paciente buscar baseado no que foi selecionado no select.
    // Quando searchField é "all", junta nome + email + telefone num texto só (comportamento original).
    // Nos outros casos, busca só no campo específico selecionado.
    const filteredPatients = patients.filter((patient) => {
        const term = searchTerm.toLowerCase()

        if (searchField === "all") {
            return [patient.fullName, patient.email, patient.phone]
                .join(" ")
                .toLowerCase()
                .includes(term)
        }

        if (searchField === "healthInsurance") {
            return (patient.healthInsurance || "").toLowerCase().includes(term)
        }

        if (searchField === "allergies") {
            return (patient.allergies || "").toLowerCase().includes(term)
        }

        if (searchField === "phone") {
            return (patient.phone || "").toLowerCase().includes(term)
        }

        return true
    })

    return (
        <div className="bg-white shadow rounded-2xl p-6 mt-8">
            <h2 className="text-xl font-semibold text-cyan-800 mb-4">
                Informações Rápidas de Pacientes
            </h2>

            {/* Campo de busca avançada */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <label htmlFor="search" className="text-gray-700 font-medium">
                    Buscar Paciente:
                </label>

                <div className="flex gap-2 w-full sm:w-auto">
                    {/* Select para escolher o campo de busca */}
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none bg-white"
                    >
                        <option value="all">Todos</option>
                        <option value="healthInsurance">Convênio</option>
                        <option value="allergies">Alergias</option>
                        <option value="phone">Telefone</option>
                    </select>

                    {/* Input de texto */}
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={
                            searchField === "all" ? "Nome, email ou telefone" :
                            searchField === "healthInsurance" ? "Digite o convênio" :
                            searchField === "allergies" ? "Digite a alergia" :
                            "Digite o telefone"
                        }
                        className="border rounded-lg px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-cyan-600 outline-none"
                    />
                </div>
            </div>

            {/* Lista de pacientes */}
            {filteredPatients.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                        <li
                            key={patient.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between py-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-cyan-100 text-cyan-700 p-3 rounded-full">
                                    <FaUserAlt size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{patient.fullName}</p>
                                    <p className="text-sm text-gray-600">{patient.email}</p>
                                    <p className="text-sm text-gray-600">{patient.phone}</p>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 mt-2 sm:mt-0 text-right">
                                <p><strong>Idade:</strong> {ages[patient.id] || "-"} anos</p>
                                <p><strong>Plano:</strong> {patient.healthInsurance || "-"}</p>
                                <Link
                                    to={`/paciente/${patient.id}`}
                                    className="text-cyan-700 font-semibold hover:underline"
                                >
                                    Ver detalhes
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center py-6">
                    Nenhum paciente encontrado
                </p>
            )}
        </div>
    )
}

export default PatientsList