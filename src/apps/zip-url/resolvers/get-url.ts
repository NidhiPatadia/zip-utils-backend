import { URLService } from '../../../services/URLService.class';

interface IGetUrlReq {
  url: string;
}

export const getUrl = async (_: unknown, args: IGetUrlReq) => {
  console.log('args:', args);
  return new URLService().getUrl(args.url);
};
