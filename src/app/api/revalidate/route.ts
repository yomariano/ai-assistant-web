import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-demand revalidation endpoint
 * Called by the API after generating new content to refresh the cache
 *
 * POST /api/revalidate
 * Body: { path: "/blog", secret: "your-secret" }
 *
 * Or with type parameter:
 * Body: { type: "blog" | "comparison" | "all", secret: "your-secret" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, type, secret } = body;

    // Verify secret token
    const expectedSecret = process.env.REVALIDATE_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate specific path
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        path,
        timestamp: new Date().toISOString()
      });
    }

    // Revalidate by content type
    const pathsToRevalidate: string[] = [];

    if (type === 'blog' || type === 'all') {
      revalidatePath('/blog');
      pathsToRevalidate.push('/blog');
    }

    if (type === 'comparison' || type === 'all') {
      revalidatePath('/compare');
      pathsToRevalidate.push('/compare');
    }

    if (pathsToRevalidate.length === 0) {
      return NextResponse.json(
        { error: 'Missing path or type parameter' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      revalidated: true,
      paths: pathsToRevalidate,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Revalidate] Error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}

// Also support GET for simple revalidation (with query params)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');
  const type = searchParams.get('type');
  const secret = searchParams.get('secret');

  // Verify secret token
  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Invalid secret' },
      { status: 401 }
    );
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString()
    });
  }

  if (type === 'blog') {
    revalidatePath('/blog');
    return NextResponse.json({
      revalidated: true,
      path: '/blog',
      timestamp: new Date().toISOString()
    });
  }

  if (type === 'comparison') {
    revalidatePath('/compare');
    return NextResponse.json({
      revalidated: true,
      path: '/compare',
      timestamp: new Date().toISOString()
    });
  }

  if (type === 'all') {
    revalidatePath('/blog');
    revalidatePath('/compare');
    return NextResponse.json({
      revalidated: true,
      paths: ['/blog', '/compare'],
      timestamp: new Date().toISOString()
    });
  }

  return NextResponse.json(
    { error: 'Missing path or type parameter' },
    { status: 400 }
  );
}
