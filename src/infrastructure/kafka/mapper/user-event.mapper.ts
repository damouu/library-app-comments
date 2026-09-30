import type {UserCreatedEventDto} from '../dto/user-created.event.dto.js';

import type {MemberProjectionData} from '../../../application/projection/dto/member-projection-data.js';


/**
 * Function to map an incoming `UserCreatedEventDto` typed request into a `MemberProjectionData`
 *
 * @param event
 * @return {MemberProjectionData} returns a MemberProjectionData mapped DTO type.
 */
export const mapUserCreatedEvent = (event: UserCreatedEventDto): MemberProjectionData => {
    return {
        memberCardUuid: event.data.member_card_uuid,
        username: event.data.user_name,
        email: event.data.email,
        avatarUrl: event.data.avatar_img_url,
    };
};