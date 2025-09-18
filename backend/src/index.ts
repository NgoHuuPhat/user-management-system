import express from 'express'
import router from '@/routes/index.routes'

const app = express()
const PORT = 3000

app.use(express.json())

app.use('/api', router)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})