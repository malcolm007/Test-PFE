import { Role } from '../diagramRole/role.model';
import { Diagram } from '../projectDetail/diagram.model';
import { User } from "../users/user.model";


export class AffectationDiagram
{
    id : number;
    dateAttribution : string;
    user: User;
    role: Role;
}