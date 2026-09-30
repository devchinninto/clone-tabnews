import orchestrator from 'tests/orchestrator.js'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.clearDatabase()
})

describe('DELETE || PUT || PATCH /api/v1/migrations', () => {
  describe('Anonymous user', () => {
    test('Running pending migrations with not allowed methods', async () => {
      const deleteResponse = await fetch(
        'http://localhost:3000/api/v1/migrations',
        {
          method: 'DELETE'
        }
      )
      const deleteResponseBody = await deleteResponse.json()

      const putResponse = await fetch(
        'http://localhost:3000/api/v1/migrations',
        {
          method: 'PUT'
        }
      )
      const putResponseBody = await putResponse.json()

      const patchResponse = await fetch(
        'http://localhost:3000/api/v1/migrations',
        {
          method: 'PATCH'
        }
      )
      const patchResponseBody = await patchResponse.json()

      expect(deleteResponseBody).toEqual({
        name: 'MethodNotAllowedError',
        message: 'Método não permitido para este endpoint.',
        action:
          'Verifique se o método HTTP enviado é valido para este endpoint.',
        status_code: 405
      })

      expect(putResponseBody).toEqual({
        name: 'MethodNotAllowedError',
        message: 'Método não permitido para este endpoint.',
        action:
          'Verifique se o método HTTP enviado é valido para este endpoint.',
        status_code: 405
      })

      expect(patchResponseBody).toEqual({
        name: 'MethodNotAllowedError',
        message: 'Método não permitido para este endpoint.',
        action:
          'Verifique se o método HTTP enviado é valido para este endpoint.',
        status_code: 405
      })
    })
  })
})
