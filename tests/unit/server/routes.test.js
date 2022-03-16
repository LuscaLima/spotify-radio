import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import config from '../../../server/config.js'
import Controller from '../../../server/controller.js'
import { handler } from '../../../server/routes'
import TestUtil from '../_utils/testUtil.js'

describe('Routes - test suite for API response', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('GET / - should redirect to home page', async () => {
    const params = TestUtil.defaultHandlerParams()
    params.request.method = 'GET'
    params.request.url = '/'

    await handler(...params.values())

    expect(params.response.writeHead).toBeCalledWith(302, {
      Location: config.locations.home
    })
    expect(params.response.end).toHaveBeenCalled()
  })

  it(`GET /home - should respose with ${config.pages.home} file stream`, async () => {
    const params = TestUtil.defaultHandlerParams()
    params.request.method = 'GET'
    params.request.url = '/home'
    const mockFileStrem = TestUtil.generateReadableStream(['Some data'])

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStrem
      })
    jest.spyOn(mockFileStrem, 'pipe').mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(config.pages.home)
    expect(mockFileStrem.pipe).toHaveBeenCalledWith(params.response)
  })

  it(`GET /controller - should respose with ${config.pages.controller} file stream`, async () => {
    const params = TestUtil.defaultHandlerParams()
    params.request.method = 'GET'
    params.request.url = '/controller'
    const mockFileStrem = TestUtil.generateReadableStream(['Some data'])

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStrem
      })
    jest.spyOn(mockFileStrem, 'pipe').mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(
      config.pages.controller
    )
    expect(mockFileStrem.pipe).toHaveBeenCalledWith(params.response)
  })

  it('GET /index.html - should respose with a file stream', async () => {
    const params = TestUtil.defaultHandlerParams()
    const filename = '/index.html'
    params.request.method = 'GET'
    params.request.url = filename
    const fileType = '.html'
    const mockFileStrem = TestUtil.generateReadableStream(['Some data'])

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStrem,
        type: fileType
      })
    jest.spyOn(mockFileStrem, 'pipe').mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(filename)
    expect(params.response.writeHead).toHaveBeenCalledWith(200, {
      'Content-Type': config.constants.CONTENT_TYPE[fileType]
    })
    expect(mockFileStrem.pipe).toHaveBeenCalledWith(params.response)
  })

  it('GET /file.ext - should respose with a file stream', async () => {
    const params = TestUtil.defaultHandlerParams()
    const filename = '/file.ext'
    params.request.method = 'GET'
    params.request.url = filename
    const fileType = '.ext'
    const mockFileStrem = TestUtil.generateReadableStream(['Some data'])

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStrem,
        type: fileType
      })
    jest.spyOn(mockFileStrem, 'pipe').mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(filename)
    expect(mockFileStrem.pipe).toHaveBeenCalledWith(params.response)
    expect(params.response.writeHead).not.toHaveBeenCalled()
  })

  it('POST /unknown - givem an inexistent route it should responde with 404', async () => {
    const params = TestUtil.defaultHandlerParams()
    params.request.method = 'POST'
    params.request.url = '/unknown'

    await handler(...params.values())

    expect(params.response.writeHead).toHaveBeenCalledWith(404)
    expect(params.response.end).toHaveBeenCalled()
  })

  describe('exceptions', () => {
    it('givem an inexistent file it should responde with 404', async () => {
      const params = TestUtil.defaultHandlerParams()
      params.request.method = 'GET'
      params.request.url = '/index.png'

      jest
        .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(new Error('Error: ENOENT'))

      await handler(...params.values())

      expect(params.response.writeHead).toHaveBeenCalledWith(404)
      expect(params.response.end).toHaveBeenCalled()
    })

    it('givem an error it should responde with 500', async () => {
      const params = TestUtil.defaultHandlerParams()
      params.request.method = 'GET'
      params.request.url = '/index.png'

      jest
        .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(new Error('Error:'))

      await handler(...params.values())

      expect(params.response.writeHead).toHaveBeenCalledWith(500)
      expect(params.response.end).toHaveBeenCalled()
    })
  })
})
