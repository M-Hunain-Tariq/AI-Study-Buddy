/** True only for storage keys owned by StudyBuddy. localStorage is shared by an origin. */
export function isStudyBuddyStorageKey(key: string): boolean {
  return key.startsWith('studybuddy_') || key.startsWith('studybuddy-') || key.startsWith('study_');
}

/** Remove StudyBuddy-owned keys without clearing other applications on the same origin. */
export function removeStudyBuddyStorage(storage: Storage): number {
  let removed = 0;
  for (let index = storage.length - 1; index >= 0; index--) {
    const key = storage.key(index);
    if (key && isStudyBuddyStorageKey(key)) {
      storage.removeItem(key);
      removed += 1;
    }
  }
  return removed;
}
