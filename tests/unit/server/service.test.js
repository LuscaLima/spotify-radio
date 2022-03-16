import { jest, describe, it, beforeEach, expect } from '@jest/globals'
import TestUtil from '../_utils/testUtil.js'
import Service from '../../../server/service.js'
import fs from 'fs'
import config from '../../../server/config'

describe('Service - test suite for core processing', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.clearAllMocks()
  })

  it('#createFileStream', () => {
    const currentStream = TestUtil.generateReadableStream(['some data'])

    jest.spyOn(fs, fs.createReadStream.name).mockReturnValue(currentStream)

    const myFile = 'file.txt'
    const result = new Service().createFileStream(myFile)

    expect(result).toStrictEqual(currentStream)
    expect(fs.createReadStream).toHaveBeenCalledWith(myFile)
  })

  it('#getFileInfo', async () => {
    jest.spyOn(fs.promises, fs.promises.access.name).mockResolvedValue()

    const myFile = 'file.txt'
    const result = await new Service().getFileInfo(myFile)
    const expected = {
      type: '.txt',
      path: `${config.directories.public}/${myFile}`
    }

    expect(result).toStrictEqual(expected)
  })

  it('#getFileStream', async () => {
    const currentStream = TestUtil.generateReadableStream(['some data'])
    const myFile = 'file.txt'
    const myFilePath = `${config.directories.public}/${myFile}`
    const service = new Service()

    jest.spyOn(service, service.getFileInfo.name).mockResolvedValue({
      path: myFilePath,
      type: '.txt'
    })

    jest
      .spyOn(service, service.createFileStream.name)
      .mockReturnValue(currentStream)

    const result = await service.getFileStream(myFile)
    const expected = {
      stream: currentStream,
      type: '.txt'
    }

    expect(service.getFileInfo).toHaveBeenCalledWith(myFile)
    expect(service.createFileStream).toHaveBeenCalledWith(myFilePath)
    expect(result).toStrictEqual(expected)
  })
})
