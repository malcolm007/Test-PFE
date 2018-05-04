import { AffectationDiagram } from './../diagramDetail/affectation.model';
import { Project } from "../projectList/project.model";
import { User } from '../users/user.model';

export class Diagram{
    id : string;
    name : string;
    description : string;
    dateCreation : string;
    projet : Project;
    affectations:AffectationDiagram[] ; 
    creator : User;
}