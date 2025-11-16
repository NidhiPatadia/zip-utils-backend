import { URLService } from '../services/URLService.class';

enum RedirectionType {
  TEXT = 't',
  URL = 'u',
}

const redirectToUrl = (url: string) => {
  return {
    statusCode: 302,
    headers: { Location: url },
    body: '',
  };
};

export const redirectHandler = async (event: any) => {
  const host = event?.headers['host'];
  const id = event?.pathParameters?.id;
  const type = host.startsWith(RedirectionType.TEXT)
    ? RedirectionType.TEXT
    : RedirectionType.URL;

  if (!id) {
    return { statusCode: 400, body: 'Invalid request' };
  }

  if (type === RedirectionType.TEXT) {
    const data = await new URLService().getZipTextById(id);
    if (!data) {
      return redirectToUrl(`${process.env.FRONTEND_DOMAIN}/404`);
    }

    const url = `${process.env.FRONTEND_DOMAIN}/${RedirectionType.TEXT}/${id}`;
    return redirectToUrl(url);
  }

  const shortUrl = await new URLService().getUrl(id);
  if (!shortUrl) {
    return redirectToUrl(`${process.env.FRONTEND_DOMAIN}/404`);
  }

  return redirectToUrl(shortUrl);
};
