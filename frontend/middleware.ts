import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('admin_token')?.value;
    const isExpired = (tok:string)=>{
      try{
        const payload = JSON.parse(Buffer.from(tok.split('.')[1], 'base64').toString());
        return payload.exp && Date.now() >= payload.exp*1000;
      }catch{return true;}
    }
    if (!token || isExpired(token)) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 