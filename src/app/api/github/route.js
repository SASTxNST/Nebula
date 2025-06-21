import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { endpoint, githubId, repoName } = await request.json();
    
    // Get GitHub token from environment variable
    const githubToken = process.env.GITHUB_TOKEN;
    
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token not configured. Please add GITHUB_TOKEN to your environment variables.' },
        { status: 500 }
      );
    }

    // Construct the GitHub API URL
    let url;
    switch (endpoint) {
      case 'repoEvents':
        url = `https://api.github.com/repos/${repoName}/events`;
        break;
      case 'repo':
        url = `https://api.github.com/repos/${repoName}`;
        break;
      case 'contributors':
        url = `https://api.github.com/repos/${repoName}/contributors`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    // Add query parameters for pagination
    const urlWithParams = new URL(url);
    urlWithParams.searchParams.set('per_page', '100');

    // Make authenticated request to GitHub API
    const response = await fetch(urlWithParams.toString(), {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Nebula-App'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API error:', response.status, errorText);
      
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded. Please try again later.' },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: `GitHub API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return the data along with rate limit headers
    return NextResponse.json({
      data,
      rateLimit: {
        remaining: response.headers.get('X-RateLimit-Remaining'),
        limit: response.headers.get('X-RateLimit-Limit'),
        reset: response.headers.get('X-RateLimit-Reset')
      }
    });

  } catch (error) {
    console.error('GitHub API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle pagination for endpoints that support it
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    const githubId = searchParams.get('githubId');
    const repoName = searchParams.get('repoName');
    const page = searchParams.get('page') || 1;
    
    const githubToken = process.env.GITHUB_TOKEN;
    
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    let url;
    switch (endpoint) {
      case 'repoEvents':
        url = `https://api.github.com/repos/${repoName}/events`;
        break;
      case 'repo':
        url = `https://api.github.com/repos/${repoName}`;
        break;
      case 'contributors':
        url = `https://api.github.com/repos/${repoName}/contributors`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    const urlWithParams = new URL(url);
    urlWithParams.searchParams.set('per_page', '100');
    urlWithParams.searchParams.set('page', page);

    const response = await fetch(urlWithParams.toString(), {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Nebula-App'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `GitHub API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      data,
      rateLimit: {
        remaining: response.headers.get('X-RateLimit-Remaining'),
        limit: response.headers.get('X-RateLimit-Limit'),
        reset: response.headers.get('X-RateLimit-Reset')
      },
      pagination: {
        hasNext: response.headers.get('Link')?.includes('rel="next"'),
        currentPage: parseInt(page)
      }
    });

  } catch (error) {
    console.error('GitHub API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 