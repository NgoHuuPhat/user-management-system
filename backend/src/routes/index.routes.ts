import { Router } from 'express'
import authRouter from '@/routes/auth.routes'
import adminRouter from '@/routes/admin.routes'
import authenticateToken from '@/middlewares/auth.middleware'
import checkAdmin from '@/middlewares/checkAdmin.middleware'

const router = Router()

router.use('/auth', authRouter)
router.use('/admin', authenticateToken, checkAdmin, adminRouter)

export default router