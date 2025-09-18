import { Router } from 'express'
import authRouter from '@/routes/auth.routes'
import adminRouter from '@/routes/admin.routes'

const router = Router()

router.use('/auth', authRouter)
router.use('/admin', adminRouter)

export default router