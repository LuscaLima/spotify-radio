import fs from 'fs'
import { extname, join } from 'path'
import config from './config.js'

export default class Service {
  createFileStream(filename) {
    return fs.createReadStream(filename)
  }

  async getFileInfo(file) {
    const fullFilePath = join(config.directories.public, file)
    await fs.promises.access(fullFilePath)
    const fileType = extname(fullFilePath)

    return {
      type: fileType,
      path: fullFilePath
    }
  }

  async getFileStream(file) {
    const { path, type } = await this.getFileInfo(file)

    return {
      stream: this.createFileStream(path),
      type
    }
  }
}
