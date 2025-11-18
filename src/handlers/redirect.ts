import { URLService } from '../services/URLService.class';

enum RedirectionType {
  TEXT = 't',
  URL = 'u',
}

const redirectToUrl = (url: string) => {
  const redirection = {
    statusCode: 302,
    headers: { Location: url, 'Content-Type': 'text/html' },
    body: '',
  };
  console.log(redirectToUrl.name, redirection);
  return redirection;
};

export const redirectHandler = async (event: any) => {
  console.log('APIGateway event:', event);
  const host = event?.headers?.Host;
  const id = event?.path?.split('/')[1];
  if (!id) {
    return { statusCode: 400, body: 'Invalid request' };
  }

  const type =
    host === process.env.TEXT_REDIRECT_CUSTOM_DOMAIN
      ? RedirectionType.TEXT
      : RedirectionType.URL;
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
