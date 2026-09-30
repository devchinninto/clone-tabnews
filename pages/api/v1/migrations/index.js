import migrationRunner from 'node-pg-migrate'
import { resolve } from 'node:path'
import database from 'infra/database'
import { createRouter } from 'next-connect'
import controller from 'infra/controller'

const router = createRouter()

router.get(getHandler)
router.post(postHandler)

export default router.handler(controller.errorHandlers)

async function defineMigrationsClientConfig() {
  const dbClient = await database.getNewClient()

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: resolve('infra', 'migrations'),
    direction: 'up',
    verbose: true,
    migrationsTable: 'pgmigrations'
  }

  return { dbClient, defaultMigrationOptions }
}

async function getHandler(request, response) {
  const { dbClient, defaultMigrationOptions } =
    await defineMigrationsClientConfig()

  try {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions)
    return response.status(200).send(pendingMigrations)
  } finally {
    await dbClient.end()
  }
}

async function postHandler(request, response) {
  const { dbClient, defaultMigrationOptions } =
    await defineMigrationsClientConfig()

  try {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false
    })

    if (migratedMigrations.length > 0) {
      return response.status(201).send(migratedMigrations)
    }

    return response.status(200).send(migratedMigrations)
  } finally {
    await dbClient.end()
  }
}
