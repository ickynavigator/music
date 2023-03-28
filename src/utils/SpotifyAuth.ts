import type { AccessToken, BaseDataType, ClientCredentials } from '@/types';
import axios from 'axios';
import faunadb, { query as q } from 'faunadb';

const tokenValid = (token: ClientCredentials) =>
  Date.now() < token.created + token.expires_in;

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;
const COLLECTION_NAME = 'token';

export class SpotifyAuth {
  faunaClient: faunadb.Client;
  public token: ClientCredentials | null = null;

  constructor() {
    this.faunaClient = new faunadb.Client({
      secret: String(process.env.FAUNA_SECRET),
      endpoint: String(process.env.FAUNA_ENDPOINT),
    });

    (async () => await this.dbCheck())();
    (async () => await this.init())();
  }

  async dbCheck() {
    await this.faunaClient.query(
      q.If(
        q.Exists(q.Collection(COLLECTION_NAME)),
        null,
        q.CreateCollection({ name: COLLECTION_NAME }),
      ),
    );
  }

  async init() {
    try {
      const data = await this.faunaClient.query<{
        data: BaseDataType<Omit<ClientCredentials, 'created'>>[];
      }>(
        q.Map(
          q.Paginate(q.Reverse(q.Documents(q.Collection(COLLECTION_NAME))), {
            size: 1,
          }),
          q.Lambda('ref', q.Get(q.Var('ref'))),
        ),
      );

      if (data.data.length > 0) {
        const [token] = data.data;
        this.token = {
          access_token: token.data.access_token,
          expires_in: token.data.expires_in,
          created: token.ts * 1000,
        };
      }

      if (!this.token || !tokenValid(this.token)) {
        await this.updateToken();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async updateToken() {
    const res = await this.getToken();

    if (res) {
      const { data } = res;

      this.token = {
        access_token: data.access_token,
        expires_in: data.expires_in,
        created: Date.now(),
      };

      await this.faunaClient.query(
        q.Create(q.Collection(COLLECTION_NAME), { data: this.token }),
      );
    }
  }

  async getToken() {
    try {
      const params = {
        grant_type: 'refresh_token',
        refresh_token: String(REFRESH_TOKEN),
      };

      const config = {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`,
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      const res = await axios.post<AccessToken>(
        'https://accounts.spotify.com/api/token',
        params,
        config,
      );

      return res;
    } catch (error) {
      console.error(error);
    }
  }
}
