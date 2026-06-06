import { createClient } from './supabase/client'

export async function uploadPlayerPhoto(file: File, userId: string): Promise<string | null> {
  try {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const filename = `${userId}-${Date.now()}.${ext}`

    const { data, error } = await supabase.storage
      .from('player-photos')
      .upload(`${userId}/${filename}`, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('player-photos')
      .getPublicUrl(data.path)

    return urlData.publicUrl
  } catch (err) {
    console.error('Errore upload foto:', err)
    return null
  }
}

export function cropImage(
  file: File,
  cropData: { x: number; y: number; width: number; height: number; scale: number }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas context failed'))

        canvas.width = cropData.width
        canvas.height = cropData.height

        ctx.drawImage(
          img,
          cropData.x,
          cropData.y,
          cropData.width,
          cropData.height,
          0,
          0,
          cropData.width,
          cropData.height
        )

        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Crop failed'))
        }, 'image/jpeg')
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

export async function getPhotoUrl(userId: string): Promise<string | null> {
  try {
    const supabase = createClient()
    const { data } = await supabase.storage
      .from('player-photos')
      .list(userId, { limit: 1, sortBy: { column: 'created_at', order: 'desc' } })

    if (data && data.length > 0) {
      const { data: urlData } = supabase.storage
        .from('player-photos')
        .getPublicUrl(`${userId}/${data[0].name}`)
      return urlData.publicUrl
    }
    return null
  } catch (err) {
    console.error('Errore recupero foto:', err)
    return null
  }
}
