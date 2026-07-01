import { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router'
import { toast } from 'react-toastify'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'

const PatientDetails = () => {
  const { id } = useParams()
  const printRef = useRef(null)
  const [patient, setPatient] = useState({})
  const [consults, setConsults] = useState([])
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  const [consultsSortOrder, setConsultsSortOrder] = useState('desc')
  const [examsSortOrder, setExamsSortOrder] = useState('desc')

  const [editingConsult, setEditingConsult] = useState(null)
  const [editConsultData, setEditConsultData] = useState({
    reason: '', date: '', time: '', description: '', medication: '', dosagePrecautions: '',
  })
  const [isEditingConsult, setIsEditingConsult] = useState(false)

  const [editingExam, setEditingExam] = useState(null)
  const [editExamData, setEditExamData] = useState({
    name: '', date: '', time: '', type: '', laboratory: '', documentUrl: '', results: '',
  })
  const [isEditingExam, setIsEditingExam] = useState(false)

const handleExportPDF = () => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 14
  const lineHeight = 7
  let y = 20

  // função auxiliar que adiciona uma nova página se o conteúdo ultrapassar o limite
  const checkNewPage = () => {
    if (y > 270) {
      pdf.addPage()
      y = 20
    }
  }

  // cabeçalho
  pdf.setFontSize(18)
  pdf.setTextColor(0, 128, 128)
  pdf.text('Prontuário do Paciente', margin, y)
  y += 10

  // dados do paciente
  pdf.setFontSize(13)
  pdf.setTextColor(30, 30, 30)
  pdf.text(`Nome: ${patient.fullName || '-'}`, margin, y); y += lineHeight
  pdf.text(`Convênio: ${patient.healthInsurance || '-'}`, margin, y); y += lineHeight
  pdf.text(`Alergias: ${patient.allergies || '-'}`, margin, y); y += lineHeight
  y += 4

  // linha divisória
  pdf.setDrawColor(0, 128, 128)
  pdf.line(margin, y, pageWidth - margin, y)
  y += 8

  // consultas
  pdf.setFontSize(14)
  pdf.setTextColor(0, 128, 128)
  pdf.text('Histórico de Consultas', margin, y)
  y += 8

  if (sortedConsults.length === 0) {
    pdf.setFontSize(11)
    pdf.setTextColor(100, 100, 100)
    pdf.text('Nenhuma consulta encontrada.', margin, y)
    y += lineHeight
  } else {
    sortedConsults.forEach((c, index) => {
      checkNewPage()
      pdf.setFontSize(11)
      pdf.setTextColor(30, 30, 30)
      pdf.text(`${index + 1}. ${c.reason} — ${c.date} ${c.time}`, margin, y); y += lineHeight
      pdf.text(`   Descrição: ${c.description || '-'}`, margin, y); y += lineHeight
      pdf.text(`   Medicação: ${c.medication || '-'}`, margin, y); y += lineHeight
      pdf.text(`   Dosagem/Precauções: ${c.dosagePrecautions || '-'}`, margin, y); y += lineHeight + 2
    })
  }

  y += 4
  pdf.setDrawColor(0, 128, 128)
  pdf.line(margin, y, pageWidth - margin, y)
  y += 8

  // exames
  pdf.setFontSize(14)
  pdf.setTextColor(0, 128, 128)
  pdf.text('Histórico de Exames', margin, y)
  y += 8

  if (sortedExams.length === 0) {
    pdf.setFontSize(11)
    pdf.setTextColor(100, 100, 100)
    pdf.text('Nenhum exame encontrado.', margin, y)
    y += lineHeight
  } else {
    sortedExams.forEach((exam, index) => {
      checkNewPage()
      pdf.setFontSize(11)
      pdf.setTextColor(30, 30, 30)
      pdf.text(`${index + 1}. ${exam.name} — ${exam.date} ${exam.time}`, margin, y); y += lineHeight
      pdf.text(`   Tipo: ${exam.type || '-'}`, margin, y); y += lineHeight
      pdf.text(`   Laboratório: ${exam.laboratory || '-'}`, margin, y); y += lineHeight
      pdf.text(`   Resultados: ${exam.results || '-'}`, margin, y); y += lineHeight + 2
    })
  }

  pdf.save(`prontuario-${patient.fullName || 'paciente'}.pdf`)
}

  const parseDateTime = (dateStr, timeStr) => {
    if (!dateStr) return new Date(0)
    let isoDate = dateStr
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('-')
      isoDate = `${year}-${month}-${day}`
    }
    return new Date(`${isoDate}T${timeStr || '00:00'}`)
  }

  const sortedConsults = useMemo(() => {
    return [...consults].sort((a, b) => {
      const dateA = parseDateTime(a.date, a.time)
      const dateB = parseDateTime(b.date, b.time)
      return consultsSortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })
  }, [consults, consultsSortOrder])

  const sortedExams = useMemo(() => {
    return [...exams].sort((a, b) => {
      const dateA = parseDateTime(a.date, a.time)
      const dateB = parseDateTime(b.date, b.time)
      return examsSortOrder === 'desc' ? dateB - dateA : dateA - dateB
    })
  }, [exams, examsSortOrder])

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const patientRes = await axios.get(`http://localhost:3000/patients/${id}`)
        const consultsRes = await axios.get(`http://localhost:3000/consults`)
        const examsRes = await axios.get(`http://localhost:3000/exams`)

        const filteredConsults = consultsRes.data.filter((c) => c.patientId === id)
        const filteredExams = examsRes.data.filter((e) => e.patientId === id)

        setPatient(patientRes.data)
        setConsults(filteredConsults)
        setExams(filteredExams)
      } catch (error) {
        console.error('Erro ao obter os detalhes do paciente:', error)
        toast.error('Erro ao carregar os dados do paciente!')
      } finally {
        setLoading(false)
      }
    }
    fetchPatientDetails()
  }, [id])

  const handleEditConsult = (consult) => {
    setEditingConsult(consult)
    setEditConsultData({
      reason: consult.reason, date: consult.date, time: consult.time,
      description: consult.description, medication: consult.medication,
      dosagePrecautions: consult.dosagePrecautions,
    })
    setIsEditingConsult(true)
  }

  const handleUpdateConsult = async (e) => {
    e.preventDefault()
    try {
      if (!editingConsult) return
      const updatedConsult = { ...editingConsult, ...editConsultData }
      await axios.put(`http://localhost:3000/consults/${editingConsult.id}`, updatedConsult)
      setConsults((prev) => prev.map((c) => (c.id === editingConsult.id ? updatedConsult : c)))
      toast.success('Consulta atualizada com sucesso!')
      setIsEditingConsult(false)
      setEditingConsult(null)
    } catch {
      toast.error('Erro ao atualizar a consulta!')
    }
  }

  const handleDeleteConsult = async (consultId) => {
    try {
      await axios.delete(`http://localhost:3000/consults/${consultId}`)
      setConsults((prev) => prev.filter((c) => c.id !== consultId))
      toast.success('Consulta excluída com sucesso!')
    } catch {
      toast.error('Erro ao excluir consulta!')
    }
  }

  const handleEditExam = (exam) => {
    setEditingExam(exam)
    setEditExamData({
      name: exam.name, date: exam.date, time: exam.time, type: exam.type,
      laboratory: exam.laboratory, documentUrl: exam.documentUrl, results: exam.results,
    })
    setIsEditingExam(true)
  }

  const handleUpdateExam = async (e) => {
    e.preventDefault()
    try {
      if (!editingExam) return
      const updatedExam = { ...editingExam, ...editExamData }
      await axios.put(`http://localhost:3000/exams/${editingExam.id}`, updatedExam)
      setExams((prev) => prev.map((exam) => (exam.id === editingExam.id ? updatedExam : exam)))
      toast.success('Exame atualizado com sucesso!')
      setIsEditingExam(false)
      setEditingExam(null)
    } catch {
      toast.error('Erro ao atualizar o exame!')
    }
  }

  const handleDeleteExam = async (examId) => {
    try {
      await axios.delete(`http://localhost:3000/exams/${examId}`)
      setExams((prev) => prev.filter((e) => e.id !== examId))
      toast.success('Exame excluído com sucesso!')
    } catch {
      toast.error('Erro ao excluir o exame!')
    }
  }

  if (loading) return <p className="p-6 text-gray-500">Carregando...</p>

  return (
    <section className="p-6 max-w-5xl mx-auto">

      {/* Barra superior: Voltar + Exportar PDF */}
      <div className="flex items-center justify-between">
        <Link to="/pacientes" className="text-cyan-700 font-semibold hover:underline">
          &larr; Voltar
        </Link>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Exportar PDF
        </button>
      </div>

      {/* Seção capturada pelo html2canvas para gerar o PDF */}
      <div ref={printRef} className="bg-gray-50 p-4 mt-6 rounded-2xl">

      {/* Card do paciente */}
<div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100">
  <h2 className="text-2xl font-semibold text-cyan-800 mb-2">{patient.fullName}</h2>
  <p><span className="font-semibold">Convênio:</span> {patient.healthInsurance}</p>
  <p><span className="font-semibold">Alergias:</span> {patient.allergies}</p>

  {/* Alerta visual de alergias — só aparece se o paciente tiver alergias cadastradas */}
  {patient.allergies && patient.allergies.trim() !== '' && (
    <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3">
      <span className="text-lg">⚠️</span>
      <p className="text-sm font-semibold">
        ATENÇÃO — Paciente possui alergias registradas: {patient.allergies}
      </p>
    </div>
  )}
</div>

        {/* Consultas */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-cyan-700">Histórico de Consultas</h3>
            {!isEditingConsult && consults.length > 0 && (
              <button
                onClick={() => setConsultsSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                className="flex items-center gap-2 text-sm text-cyan-700 hover:text-cyan-900 font-medium"
              >
                {consultsSortOrder === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
                {consultsSortOrder === 'desc' ? 'Mais recentes' : 'Mais antigas'}
              </button>
            )}
          </div>

          {isEditingConsult ? (
            <form onSubmit={handleUpdateConsult} className="space-y-4">
              {Object.keys(editConsultData).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                    {key === 'dosagePrecautions' ? 'Dosagem e Precauções' : key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type={key.includes('date') ? 'date' : key.includes('time') ? 'time' : 'text'}
                    value={editConsultData[key]}
                    onChange={(e) => setEditConsultData({ ...editConsultData, [key]: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                    required
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg transition">Salvar</button>
                <button type="button" onClick={() => setIsEditingConsult(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition">Cancelar</button>
              </div>
            </form>
          ) : consults.length === 0 ? (
            <p className="text-gray-500">Nenhuma consulta encontrada.</p>
          ) : (
            sortedConsults.map((c) => (
              <div key={c.id} className="border rounded-xl p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition">
                <p><strong>Consulta:</strong> {c.reason}</p>
                <p><strong>Data:</strong> {c.date} - {c.time}</p>
                <p><strong>Descrição:</strong> {c.description}</p>
                <p><strong>Medicação:</strong> {c.medication}</p>
                <p><strong>Dosagem e Precauções:</strong> {c.dosagePrecautions}</p>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => handleEditConsult(c)} className="bg-cyan-700 hover:bg-cyan-800 text-white px-3 py-1 rounded-md text-sm">Editar</button>
                  <button onClick={() => handleDeleteConsult(c.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Deletar</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Exames */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-cyan-700">Histórico de Exames</h3>
            {!isEditingExam && exams.length > 0 && (
              <button
                onClick={() => setExamsSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                className="flex items-center gap-2 text-sm text-cyan-700 hover:text-cyan-900 font-medium"
              >
                {examsSortOrder === 'desc' ? <FaSortAmountDown /> : <FaSortAmountUp />}
                {examsSortOrder === 'desc' ? 'Mais recentes' : 'Mais antigos'}
              </button>
            )}
          </div>

          {isEditingExam ? (
            <form onSubmit={handleUpdateExam} className="space-y-4">
              {Object.keys(editExamData).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                    {key === 'documentUrl' ? 'URL do Documento' : key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  {key === 'results' ? (
                    <textarea
                      value={editExamData[key]}
                      onChange={(e) => setEditExamData({ ...editExamData, [key]: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                      rows="3"
                      required
                    />
                  ) : (
                    <input
                      type={key.includes('date') ? 'date' : key.includes('time') ? 'time' : 'text'}
                      value={editExamData[key]}
                      onChange={(e) => setEditExamData({ ...editExamData, [key]: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none"
                      required={key !== 'documentUrl'}
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-lg transition">Salvar</button>
                <button type="button" onClick={() => setIsEditingExam(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition">Cancelar</button>
              </div>
            </form>
          ) : exams.length === 0 ? (
            <p className="text-gray-500">Nenhum exame encontrado.</p>
          ) : (
            sortedExams.map((exam) => (
              <div key={exam.id} className="border rounded-xl p-4 mb-4 bg-gray-50 hover:bg-gray-100 transition">
                <p><strong>Exame:</strong> {exam.name}</p>
                <p><strong>Data:</strong> {exam.date} - {exam.time}</p>
                <p><strong>Tipo:</strong> {exam.type}</p>
                <p><strong>Laboratório:</strong> {exam.laboratory}</p>
                <p><strong>Documento:</strong> {exam.documentUrl}</p>
                <p><strong>Resultados:</strong> {exam.results}</p>
                <div className="flex gap-3 mt-3">
                  <button onClick={() => handleEditExam(exam)} className="bg-cyan-700 hover:bg-cyan-800 text-white px-3 py-1 rounded-md text-sm">Editar</button>
                  <button onClick={() => handleDeleteExam(exam.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">Deletar</button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </section>
  )
}

export default PatientDetails