import {MemberProjectionModel} from '../database/mongo/member-projection.schema.js';

import type {MemberProjectionRepositoryPort} from '../../application/ports/member-projection.repository.port.js';
import type {MemberProjectionData} from '../../application/projection/dto/member-projection-data.js';
import type {MemberProjectionUpdateData} from '../../application/projection/dto/member-projection-update-data.js';

export class MemberProjectionRepository
    implements MemberProjectionRepositoryPort {

    async upsert(data: MemberProjectionData): Promise<void> {
        await MemberProjectionModel.findOneAndUpdate(
            {
                member_card_uuid: data.memberCardUuid,
            },
            {
                $set: {
                    user_name: data.username,
                    email: data.email,
                    avatar_img_url: data.avatarUrl,
                },
            },
            {
                upsert: true,
                new: true,
                runValidators: true,
            },
        );
    }

    async findByMemberCardUuid(memberCardUuid: string) {
        const member = await MemberProjectionModel.findOne({member_card_uuid: memberCardUuid}).lean();

        if (!member) {
            return null;
        }

        return {
            memberCardUuid: member.member_card_uuid,
            username: member.user_name,
            email: member.email,
            avatarUrl: member.avatar_img_url,
        };
    }

    async update(data: MemberProjectionUpdateData): Promise<void> {
        const updateData = {
            ...(data.username !== undefined && {
                user_name: data.username,
            }),

            ...(data.email !== undefined && {
                email: data.email,
            }),

            ...(data.avatarUrl !== undefined && {
                avatar_img_url: data.avatarUrl,
            }),
        };

        if (Object.keys(updateData).length === 0) {
            return;
        }

        const result = await MemberProjectionModel.findOneAndUpdate(
            {
                member_card_uuid: data.memberCardUuid,
            },
            {
                $set: updateData,
            },
            {
                new: true,
                runValidators: true,
            },
        );

        if (!result) {
            throw new Error(
                `Member projection not found: ${data.memberCardUuid}`,
            );
        }
    }
}