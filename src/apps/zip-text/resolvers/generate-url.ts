import { URLService } from '../../../services/URLService.class';

interface IGenerateZipTextUrlReq {
  text: string;
}

export const generateZipTextUrl = async (_: unknown, args: IGenerateZipTextUrlReq) => {
  console.log('args:', args);
  return new URLService().generateZipTextUrl(args.text);
};
