export interface VideoInfo {
  type: 'youtube' | 'vimeo' | null
  id: string | null
}

export function parseVideoUrl(url: string): VideoInfo {
  if (!url) return { type: null, id: null }

  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern)
    if (match?.[1]) {
      return { type: 'youtube', id: match[1] }
    }
  }

  // Vimeo patterns
  const vimeoPattern = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
  const vimeoMatch = url.match(vimeoPattern)
  if (vimeoMatch?.[1]) {
    return { type: 'vimeo', id: vimeoMatch[1] }
  }

  return { type: null, id: null }
}

export function getVideoEmbedUrl(url: string): string | null {
  const video = parseVideoUrl(url)
  if (video.type === 'youtube' && video.id) {
    return `https://www.youtube.com/embed/${video.id}?rel=0`
  }
  if (video.type === 'vimeo' && video.id) {
    return `https://player.vimeo.com/video/${video.id}`
  }
  return null
}
