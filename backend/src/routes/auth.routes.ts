import { Router } from 'express'
import authController from '@/controllers/auth.controller'

const router = Router()

router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/refresh-token', authController.refreshToken)
router.get('/me', authController.getMe)

export default router