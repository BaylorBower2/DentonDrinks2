export function validateVenueType(type: string | undefined): type is 'bars' | 'breweries' {
  return type === 'bars' || type === 'breweries';
}

export function getVenueTypeFromPath(path: string): 'bar' | 'brewery' | null {
  if (!path) return null;
  const match = path.match(/^\/(bars|breweries)/);
  return match ? (match[1] === 'bars' ? 'bar' : 'brewery') : null;
}

export function buildVenueUrl(type: 'bar' | 'brewery', id: string): string {
  return `/${type}s/${id}`;
}