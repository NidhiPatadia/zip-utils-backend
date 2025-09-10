import { URLService } from '../../../services/URLService.class';

interface IGenerateUrlReq {
  url: string;
  expiryInMinutes?: number;
}

export const generateUrl = async (_: unknown, args: IGenerateUrlReq) => {
  console.log('args:', args);
  return new URLService().generateUrl(args.url, args.expiryInMinutes);
};
