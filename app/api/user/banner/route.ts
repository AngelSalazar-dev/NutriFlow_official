import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-mysql';
import { query } from '@/lib/mysql';

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { avatarType, avatarUrl } = body;

    if (!avatarType) {
      return NextResponse.json({ error: 'bannerType is required' }, { status: 400 });
    }

    // For custom banners, URL is required
    if (avatarType === 'custom' && !avatarUrl) {
      return NextResponse.json({ error: 'bannerUrl is required for custom banners' }, { status: 400 });
    }

    await query(
      'UPDATE users SET banner_type = ?, banner_url = ? WHERE id = ?',
      [avatarType, avatarType === 'preset' ? (avatarUrl || null) : avatarUrl, user._id]
    );

    return NextResponse.json({ success: true, bannerType: avatarType, bannerUrl: avatarUrl });
  } catch (error: any) {
    console.error('Banner update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
