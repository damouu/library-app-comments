import {UserConsumer} from "./infrastructure/kafka/consumers/user.consumer.js";
import {MemberEventHandler} from "./infrastructure/kafka/handlers/member-event.handler.js";

import {MemberProjectionService} from "./application/projection/member-projection.service.js";
import {MemberProjectionRepository} from "./infrastructure/repositories/member-projection.repository.js";

export function createMemberConsumer(): UserConsumer {
    const repository = new MemberProjectionRepository();

    const projectionService = new MemberProjectionService(repository);

    const eventHandler = new MemberEventHandler(projectionService);

    return new UserConsumer(
        (event) => eventHandler.handle(event),
    );
}