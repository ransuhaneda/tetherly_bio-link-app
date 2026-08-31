export function formatDeletionDate(deletionDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${deletionDate}T00:00:00Z`));
}
