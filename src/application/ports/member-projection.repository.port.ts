import type {MemberProjectionData} from '../projection/dto/member-projection-data.js';
import type {MemberProjectionUpdateData} from '../projection/dto/member-projection-update-data.js';

export interface MemberProjectionRepositoryPort {

    upsert(data: MemberProjectionData): Promise<void>;

    update(data: MemberProjectionUpdateData): Promise<void>;

    findByMemberCardUuid(memberCardUuid: string): Promise<MemberProjectionData | null>;
}