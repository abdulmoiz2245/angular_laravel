import slugify from 'slugify';

export function slugifyString(text: string): string {
    if ( ! text) return text;
    return slugify(text, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
    });
}
