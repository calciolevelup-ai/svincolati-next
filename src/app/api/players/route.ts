import { createClient } from '@/lib/supabase/server'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const sport = searchParams.get('sport') || 'calcio'
  const ruolo = searchParams.get('ruolo')
  const regione = searchParams.get('regione')
  const search = searchParams.get('search')

  let query = supabase.from('player_profiles').select('*').eq('sport', sport).neq('staff_type', null)

  if (ruolo) query = query.eq('ruolo', ruolo)
  if (regione) query = query.eq('regione', regione)
  if (search) query = query.ilike('nome', `%${search}%`)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
