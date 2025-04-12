import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    if (!url) {
      return new NextResponse('Missing URL parameter', { status: 400 })
    }

    console.log('Proxying image URL:', url)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.facebook.com/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site'
      }
    })

    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText)
      return new NextResponse('Failed to fetch image', { status: response.status })
    }

    const contentType = response.headers.get('content-type')
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 