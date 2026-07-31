import type { NotationPack, PaletteEntry } from './types'

export function paletteEntryId(entry: PaletteEntry): string {
  return entry.id ?? entry.nodeTypeId
}

/** Palette entries whose node type is allowed on the given diagram kind. */
export function getPaletteForKind(
  pack: NotationPack,
  diagramKind: string,
): PaletteEntry[] {
  return pack.palette.filter((entry) =>
    pack.nodeTypes
      .find((n) => n.id === entry.nodeTypeId)
      ?.diagramKinds.includes(diagramKind),
  )
}
