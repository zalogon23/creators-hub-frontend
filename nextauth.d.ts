import { UserDTO } from "@/dtos/UserDTO";

declare module "next-auth" {
    interface Session extends DefaultSession {
        customUser: UserDTO;
    }
}