

export function truthy(value: any): boolean {
  return value !== undefined && value !== null && value !== false;
}

export function falsy(value: any): boolean {
  return !value;
}

export function empty(value: any): boolean {
  return value === undefined || value === null || value === ''
    || (Array.isArray(value) && value.length === 0)
    || (typeof value === 'object' && Object.keys(value).length === 0);
}

export function exists(value: any): boolean {
  return !empty(value);
}
