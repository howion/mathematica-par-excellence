import type { NextApiRequest, NextApiResponse } from 'next'

let i = 0

export default async function Map(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    // res.status(200).send('')
    res.status(200).send(++i)
}
