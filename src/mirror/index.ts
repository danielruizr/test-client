import { EarnAllianceBaseClient } from 'src/base';
import { GET_ENTRIES, GET_ENTRIES_DIGESTS_AND_PUBLISHER_BY_ADDRESS, GET_ENTRY_BY_DIGEST, GET_ENTRY_PUBLISHER_BY_DIGEST } from './queries/entries';

export class EarnAllianceMirrorClient extends EarnAllianceBaseClient {
    async getPost(addresses: string[], forceRefresh = false) {
        const result = await Promise.all(
            addresses.map(projectAddress => this.query<{ mirror: { entries: any[] } }>(GET_ENTRIES, { projectAddress }, { forceRefresh }))
        );
        return result
            .map(
                ({
                    data: {
                        mirror: { entries },
                    },
                }) => entries
            )
            .flat()
            .sort((a, b) => b.timestamp - a.timestamp);
    }

    async getDigestsByAddress(projectAddress: string, forceRefresh = false) {
        const {
            data: {
                mirror: { entries },
            },
        } = await this.query<{ mirror: { entries: { originalDigest: string; publisher: { project: { address: string } } }[] } }>(
            GET_ENTRIES_DIGESTS_AND_PUBLISHER_BY_ADDRESS,
            { projectAddress },
            { forceRefresh }
        );
        return {
            digests: entries.map(v => v.originalDigest),
            author: entries[0]?.publisher.project.address,
        };
    }
    async getPostByDigest(digest: string, forceRefresh = false) {
        const {
            data: {
                mirror: { entry },
            },
        } = await this.query<{ mirror: { entry: any } }>(GET_ENTRY_BY_DIGEST, { digest }, { forceRefresh });
        return entry;
    }
    async getPostPublisherByDigest(digest: string, forceRefresh = false) {
        const {
            data: {
                mirror: {
                    entry: {
                        publisher: {
                            project: { address },
                        },
                    },
                },
            },
        } = await this.query<{ mirror: { entry: { publisher: { project: { address: string } } } } }>(
            GET_ENTRY_PUBLISHER_BY_DIGEST,
            { digest },
            { forceRefresh }
        );
        return address;
    }
}
