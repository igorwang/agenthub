import { bizApi } from './request';

export function getSignedUrl(bucket:string,key:string) {
  return bizApi.post<{ data: { url: string } }>('/file/get_signed_url', {
    bucket,
    key
  });
}
