import { gql } from '@apollo/client';
import { GAME_DETAIL_FIELDS } from './fragments/game-detail-fields';

export const FOLLOW_GAME = gql`
    mutation FollowGame($id: uuid!) {
        payload: followGame(data: { id: $id, sns: ["twitter"] }) {
            success
        }
    }
`;
