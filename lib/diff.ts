import { diff_match_patch, DIFF_DELETE, DIFF_INSERT, type Diff } from "diff-match-patch"

export interface DiffSegment {
  text: string
  type: "equal" | "insert" | "delete"
}

/**
 * Generate a semantic diff between two verse strings.
 */
export function diffVerses(original: string, translated: string): DiffSegment[] {
  const dmp = new diff_match_patch()
  const diffs: Diff[] = dmp.diff_main(original, translated)
  dmp.diff_cleanupSemantic(diffs)
  return diffs.map(([op, text]) => ({
    text,
    type: op === DIFF_INSERT ? "insert" : op === DIFF_DELETE ? "delete" : "equal",
  }))
}
