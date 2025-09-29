import { Request, Response, NextFunction } from 'express'
import cloudinaryUploader from '@/utils/cloudinaryUploader'

const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next()
  }

  try {
    const result = await cloudinaryUploader(req.file)
    req.body.avatar = result.secure_url
    next()
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}

export default uploadToCloudinary