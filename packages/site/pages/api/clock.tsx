import { NextApiHandler } from 'next'

const hello: NextApiHandler = (req, res) => {
  const stamp = new Date(Math.round(+new Date() / 100) * 100)
  res.status(200).json({
    stamp: stamp.toISOString()
  })
}

export default hello
