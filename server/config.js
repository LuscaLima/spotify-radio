import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const defaultPort = 3000

const fileURL = import.meta.url
const filePath = fileURLToPath(fileURL)
const currentDir = dirname(filePath)

const root = join(currentDir, '..')
const audio = join(root, 'audio')
const publicDir = join(root, 'public')

export default {
  port: process.env.PORT || defaultPort,
  directories: {
    root,
    audio: {
      self: audio,
      fx: join(audio, 'fx'),
      songs: join(audio, 'songs')
    },
    public: publicDir
  },
  pages: {
    home: 'home/index.html',
    controller: 'controller/index.html'
  },
  locations: {
    home: '/home'
  },
  constants: {
    CONTENT_TYPE: {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript'
    }
  }
}
