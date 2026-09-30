import type {UserEventDto} from '../dto/user.event.dto.js';

import {mapUserCreatedEvent} from '../mapper/user-event.mapper.js';

import type {MemberProjectionService} from '../../../application/projection/member-projection.service.js';

export class MemberEventHandler {

    constructor(
        private readonly memberProjectionService: MemberProjectionService,
    ) {}

    async handle(event: UserEventDto): Promise<void> {
        const data = mapUserCreatedEvent(event);

        await this.memberProjectionService.handleCreated(data);
    }
}