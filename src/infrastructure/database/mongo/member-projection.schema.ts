import {model, Schema} from 'mongoose';

const memberProjectionSchema = new Schema(
    {
        member_card_uuid: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        user_name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },

        avatar_img_url: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

export const MemberProjectionModel = model(
    'MemberProjection',
    memberProjectionSchema,
);