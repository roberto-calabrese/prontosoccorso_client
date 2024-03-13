import type {RouteParams} from "vue-router";

const uppercaseFirstLetter = (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export {
    uppercaseFirstLetter
}