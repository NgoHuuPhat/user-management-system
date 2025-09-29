import { UploadApiResponse } from 'cloudinary'
import cloudinary from '@/config/cloudinary'
import streamifier from 'streamifier'

const cloudinaryUploader = (file: Express.Multer.File) => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: `user-management-system/${file.fieldname}` },
      (error, result) => {
        if (result) resolve(result)
        else reject(error)
      }
    )
    streamifier.createReadStream(file.buffer).pipe(stream)
  })
}

export default cloudinaryUploader