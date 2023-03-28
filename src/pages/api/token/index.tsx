import { cors, runMiddleware, SpotifyAuth } from '@/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

const auth = new SpotifyAuth();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await runMiddleware(req, res, cors);

  switch (req.method) {
    case 'GET': {
      return res.status(200).json(auth.token);
    }

    default: {
      return res.status(405).json({
        message: 'Method not allowed',
      });
    }
  }
}
