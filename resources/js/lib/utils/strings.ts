export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

export function camelCase(str: string) {
    return str.replace(/-/g, '').replace(/\s+/g, '');
}


export function snakeCase(str: string) {
    return str.replace(/ /g, '_').replace(/[^\w\s]/g, '');
}


export function kebabCase(str: string) {
    return str.replace(/ /g, '-').replace(/[^\w\s]/g, '');
}

