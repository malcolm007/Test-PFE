import { User } from "../users/user.model";
import { AffectationDiagram } from "../diagramDetail/affectation.model";

export class Project {
    id: string;
    name: string;
    description: string;
    dateCreation : string;
    user: User;
    affectations:AffectationDiagram[] ; 
  }