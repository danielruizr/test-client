export const getUrl = (path: string) => {
    return `https://${process.env.NEXT_PUBLIC_CDN_HOST}/${path}`;
};
