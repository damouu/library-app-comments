import type {MemberProjectionData} from './dto/member-projection-data.js';
import type {MemberProjectionUpdateData} from './dto/member-projection-update-data.js';
import type {MemberProjectionRepositoryPort} from '../ports/member-projection.repository.port.js';

export class MemberProjectionService {

    constructor(
        private readonly memberProjectionRepository: MemberProjectionRepositoryPort,
    ) {
    }

    async handleCreated(data: MemberProjectionData): Promise<void> {
        await this.memberProjectionRepository.upsert(data);
    }

    async handleUpdated(data: MemberProjectionUpdateData): Promise<void> {
        await this.memberProjectionRepository.update(data);
    }
}