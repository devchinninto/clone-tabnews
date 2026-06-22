import database from 'infra/database.js'

beforeAll(cleanDatabase)

async function cleanDatabase() {
  await database.query('drop schema public cascade; create schema public')
}

test('POST to /api/v1/migrations should return 201', async () => {
  const firstPostResponse = await fetch(
    'http://localhost:3000/api/v1/migrations',
    {
      method: 'POST'
    }
  )
  const secondPostResponse = await fetch(
    'http://localhost:3000/api/v1/migrations',
    {
      method: 'POST'
    }
  )

  const firstResponseBody = await firstPostResponse.json()
  const secondResponseBody = await secondPostResponse.json()

  const pgmigrationsQueryResult = await database.query(
    'SELECT * FROM pgmigrations;'
  )
  const pgmigrationsNameValue = pgmigrationsQueryResult.rows[0].name

  const databaseName = process.env.POSTGRES_DB
  const databaseOpenedConnectionsResult = await database.query({
    text: 'SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;',
    values: [databaseName]
  })
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count

  expect(firstPostResponse.status).toBe(201)
  expect(secondPostResponse.status).toBe(200)

  expect(Array.isArray(firstResponseBody)).toBe(true)
  expect(firstResponseBody.length).toBeGreaterThan(0)

  expect(Array.isArray(secondResponseBody)).toBe(true)
  expect(secondResponseBody.length).toEqual(0)

  expect(firstResponseBody[0].name).toEqual(pgmigrationsNameValue)
  expect(databaseOpenedConnectionsValue).toEqual(1)
})
