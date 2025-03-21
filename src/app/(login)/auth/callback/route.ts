import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/api/client';

/**
 * Supabase認証コールバックを処理するルートハンドラ
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL('/', request.url));
}
