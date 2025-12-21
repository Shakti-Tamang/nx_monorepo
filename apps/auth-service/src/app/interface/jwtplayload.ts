
import { role} from "../entity/role.entity";

export interface JwtPayload {
    sub: string; // User ID
    name: string;
    role: role;
    address?: string;
    contact?: number;
    about?: string;

    
  }