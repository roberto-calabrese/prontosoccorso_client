const uppercaseFirstLetter = (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
const createSlug = (str: string): string  => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

const slugToTitle = (input:string) => {
    return input
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export {
    uppercaseFirstLetter,
    createSlug,
    slugToTitle
}