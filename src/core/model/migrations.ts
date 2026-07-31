import { DIAGRAM_SCHEMA_VERSION } from './schema'

type Migration = (file: Record<string, unknown>) => Record<string, unknown>

/** Keyed by the version the migration upgrades FROM. */
const migrations: Record<number, Migration> = {
  // 1: (file) => ({ ...file, schemaVersion: 2, ... })
}

export function migrateDiagramFile(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  let file = raw
  let version = typeof file.schemaVersion === 'number' ? file.schemaVersion : 0
  if (version < 1 || version > DIAGRAM_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported diagram schema version ${String(file.schemaVersion)} (this app supports 1..${DIAGRAM_SCHEMA_VERSION})`,
    )
  }
  while (version < DIAGRAM_SCHEMA_VERSION) {
    const migrate = migrations[version]
    if (!migrate) {
      throw new Error(`Missing migration from schema version ${version}`)
    }
    file = migrate(file)
    version += 1
  }
  return file
}
