import * as hasuraService from '../hasura';
import { GET_ENTRIES, GET_ENTRIES_DIGESTS_AND_PUBLISHER_BY_ADDRESS, GET_ENTRY_BY_DIGEST, GET_ENTRY_PUBLISHER_BY_DIGEST } from "./queries/entries";

export const getPost = async (addresses: string[], forceRefresh = false) => {
  const result = await Promise.all(addresses.map(projectAddress => hasuraService.query<{mirror: {entries: any[]}}>(
    GET_ENTRIES,
    {projectAddress},
    {forceRefresh},
  )))
  return result.map(({data: {mirror: {entries}}}) => entries).flat().sort((a, b) => b.timestamp - a.timestamp);
}

export const getDigestsByAddress = async (projectAddress: string, forceRefresh = false) => {
  const {data: {mirror: {entries}}} = await hasuraService.query<{mirror: {entries: {originalDigest: string, publisher: {project: {address: string}}}[]}}>(
    GET_ENTRIES_DIGESTS_AND_PUBLISHER_BY_ADDRESS,
    {projectAddress},
    {forceRefresh},
  );
  return {
    digests: entries.map(v => v.originalDigest),
    author: entries[0]?.publisher.project.address
  };
}
export const getPostByDigest = async (digest: string, forceRefresh = false) => {
  const {data: {mirror: {entry}}} = await hasuraService.query<{mirror: {entry: any}}>(
    GET_ENTRY_BY_DIGEST,
    {digest},
    {forceRefresh},
  );
  return entry
}
export const getPostPublisherByDigest = async (digest: string, forceRefresh = false) => {
  const {
    data: {
      mirror: {
        entry: {
          publisher: {
            project: {address}
          }
        }
      }
    }
  } = await hasuraService.query<{mirror: {entry: {publisher: {project: {address: string}}}}}>(
    GET_ENTRY_PUBLISHER_BY_DIGEST,
    {digest},
    {forceRefresh},
  );
  return address
}