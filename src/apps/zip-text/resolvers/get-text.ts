import { URLService } from '../../../services/URLService.class';

interface IGetUrlReq {
  url: string;
}

export const getZipText = async (_: unknown, args: IGetUrlReq) => {
  console.log('args:', args);
  return new URLService().getZipTextById(args.url);
};
