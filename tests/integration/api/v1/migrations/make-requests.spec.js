import database from 'infra/database.js'

beforeAll(cleanDatabase)

async function cleanDatabase() {
  await database.query('drop schema public cascade; create schema public')
}

test('Methods that are not "GET" or "POST" to /api/v1/migrations should return 405', async () => {
  const deleteResponse = await fetch(
    'http://localhost:3000/api/v1/migrations',
    {
      method: 'DELETE'
    }
  )

  const putResponse = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'PUT'
  })

  const patchResponse = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'PATCH'
  })

  const databaseName = process.env.POSTGRES_DB
  const databaseOpenedConnectionsResult = await database.query({
    text: 'SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;',
    values: [databaseName]
  })
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count

  expect(databaseOpenedConnectionsValue).toBe(1)

  expect(deleteResponse.status).toBe(405)
  expect(putResponse.status).toBe(405)
  expect(patchResponse.status).toBe(405)
})
