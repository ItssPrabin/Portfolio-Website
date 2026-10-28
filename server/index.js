import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 5000)

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/projects', (request, response) => {
  response.json([
    {
      number: '01',
      type: 'BACKEND · 2026',
      title: 'PalmMind RAG Backend',
      description: 'Worked with FastAPI on a backend for document ingestion, chat, retrieval, and interview booking.',
      tags: ['FastAPI', 'Python'],
      artwork: 'rag',
      url: 'https://github.com/ItssPrabin/RAG-for-Interview-Booking',
    },
    {
      number: '02',
      type: 'WEB APPLICATION · 2026',
      title: 'Resume Ranking System',
      description: 'Worked with Flask, HTML, CSS, and JavaScript to build a resume ranking system.',
      tags: ['Flask', 'HTML', 'CSS', 'JavaScript'],
      artwork: 'resume',
      url: 'https://github.com/ItssPrabin/College-Minor-Project',
    },
  ])
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'The server could not complete that request.' })
})

app.listen(port, () => console.log(`API server running at http://localhost:${port}`))
