import { Router } from 'express'
import adminController from '@/controllers/admin.controller'

const router = Router()

router.post('/roles', adminController.createRole)
router.get('/roles', adminController.listRoles)
router.patch('/roles/:id', adminController.updateRole)
router.delete('/roles/:id', adminController.deleteRole)

router.get('/users', adminController.listUsers)
router.get('/users/:id', adminController.getUserById)
router.post('/users', adminController.createUser)
router.patch('/users/:id', adminController.updateUser)
router.delete('/users/:id', adminController.deleteUser)


export default router