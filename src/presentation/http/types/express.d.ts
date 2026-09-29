import type {AuthenticatedUser} from "../../../application/types/authenticated-user.js";

declare global {
    namespace Express {
        interface Request {
            user: AuthenticatedUser;
        }
    }
}

export {};