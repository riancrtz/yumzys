const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const MAX_SIDE = 1280

export const UPLOADS_ENABLED = Boolean(CLOUD && PRESET)

async function shrink(file) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not process image'))),
      'image/jpeg',
      0.82
    )
  })
}

export async function uploadPhoto(file) {
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file')

  let blob
  try {
    blob = await shrink(file)
  } catch {
    throw new Error('Could not read that image. Try a JPG or PNG.')
  }

  const body = new FormData()
  body.append('file', blob)
  body.append('upload_preset', PRESET)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body,
  })
  if (!response.ok) throw new Error('Upload failed. Try again.')

  const data = await response.json()
  return data.secure_url
}