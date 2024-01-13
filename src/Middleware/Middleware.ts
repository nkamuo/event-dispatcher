import { Envelope } from "../Messege";

export interface IMiddleware
{
    handle(envelope: Envelope, stack: IStack): Envelope;
}

export abstract class AbstractMiddleware implements IMiddleware{
    
    abstract handle(envelope: Envelope, stack: IStack): Envelope;

}


export interface IStack{
    next(): void;
}