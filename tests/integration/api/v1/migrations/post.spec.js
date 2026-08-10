import database from 'infra/database.js'
import orchestrator from 'tests/orchestrator.js'

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await orchestrator.clearDatabase()
})

describe('POST /api/v1/migrations', () => {
  describe('Anonymous user', () => {
    describe('Running pending migrations', () => {
      test('For the first time', async () => {
        const firstPostResponse = await fetch(
          'http://localhost:3000/api/v1/migrations',
          {
            method: 'POST'
          }
        )

        const firstResponseBody = await firstPostResponse.json()

        expect(firstPostResponse.status).toBe(201)
        expect(Array.isArray(firstResponseBody)).toBe(true)
        expect(firstResponseBody.length).toBeGreaterThan(0)
      })

      test('For the second time', async () => {
        const secondPostResponse = await fetch(
          'http://localhost:3000/api/v1/migrations',
          {
            method: 'POST'
          }
        )

        const secondResponseBody = await secondPostResponse.json()

        const databaseName = process.env.POSTGRES_DB
        const databaseOpenedConnectionsResult = await database.query({
          text: 'SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;',
          values: [databaseName]
        })
        const databaseOpenedConnectionsValue =
          databaseOpenedConnectionsResult.rows[0].count

        expect(secondPostResponse.status).toBe(200)
        expect(Array.isArray(secondResponseBody)).toBe(true)
        expect(secondResponseBody.length).toEqual(0)
        expect(databaseOpenedConnectionsValue).toEqual(1)
      })
    })
  })
})
