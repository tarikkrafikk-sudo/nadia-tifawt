import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Site is alive!',
    time: new Date().toISOString() 
  })
}
