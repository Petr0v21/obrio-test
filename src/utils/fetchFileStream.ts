import { randomUUID } from 'crypto';
import { IncomingHttpHeaders } from 'http';
import { request } from 'undici';

function getFilenameFromUrlOrHeaders(
  url: string,
  headers: IncomingHttpHeaders,
) {
  const disposition = headers['content-disposition'];
  if (disposition?.includes('filename=')) {
    const filename = disposition.match(
      /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
    )?.[1];
    return filename?.replace(/['"]/g, '');
  }

  const fromUrl = decodeURIComponent(
    new URL(url).pathname.split('/').pop() || '',
  );
  if (fromUrl) return fromUrl;
  return `unknown_file-${randomUUID()}`;
}

export async function fetchFileStream(url: string) {
  const { body, statusCode, headers } = await request(url);

  if (statusCode >= 400) {
    throw new Error(`Failed to fetch file: ${statusCode}`);
  }

  if (!body) {
    throw new Error('No body received in the response');
  }

  return {
    stream: body,
    fileName: getFilenameFromUrlOrHeaders(url, headers),
    mimeType: headers['content-type'] || 'application/octet-stream',
  };
}
