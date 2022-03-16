import { jest, describe, it, beforeEach, expect } from '@jest/globals'
import Controller from '../../../server/controller'
import Service from '../../../server/service'
import TestUtil from '../_utils/testUtil.js'

describe('Controller - test suite for controller calls', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('#getFileStream', async () => {
    const currentStream = TestUtil.generateReadableStream(['some data'])
    const myFile = 'file.txt'

    jest
      .spyOn(Service.prototype, Service.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: currentStream,
        type: '.txt'
      })

    const controller = new Controller()
    const result = await controller.getFileStream(myFile)
    const expected = {
      stream: currentStream,
      type: '.txt'
    }

    expect(result).toStrictEqual(expected)
    expect(controller.service.getFileStream).toHaveBeenCalledWith(myFile)
  })
})
