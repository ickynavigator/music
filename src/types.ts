import type { query as q } from 'faunadb';

export type BaseDataType<T = any> = {
  ref: typeof q.Ref;
  ts: number;
  data: T;
};

export type AccessToken = {
  access_token: string;
  token_type: 'Bearer' | (string & {});
  scope: string;
  expires_in: number;
};

export type ClientCredentials = {
  access_token: string;
  expires_in: number;
  created: number;
};
