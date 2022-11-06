export declare const getPost: (addresses: string[], forceRefresh?: boolean) => Promise<any[]>;
export declare const getDigestsByAddress: (projectAddress: string, forceRefresh?: boolean) => Promise<{
    digests: string[];
    author: string;
}>;
export declare const getPostByDigest: (digest: string, forceRefresh?: boolean) => Promise<any>;
export declare const getPostPublisherByDigest: (digest: string, forceRefresh?: boolean) => Promise<string>;
