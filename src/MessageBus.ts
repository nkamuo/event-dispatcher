


export interface IMessageBusConfig<T>{
    bus: IMessageBus<T>;
    async: false, 
} 


export interface IMessageBus<T>{
     dispatch(event: number|string|symbol, message?: T, stamps?: any[]): Promise<any>;
}




export class MessageBus<T> implements IMessageBus<T>{
    
    private events:{[i:string|number|symbol]: SubEvent} = {};


    async dispatch(event: number| string| symbol, data?: T, stamps?: any[]): Promise<void> {
        if(!(event in this.events))
            return;
        const subEvent = this.events[event];

        subEvent.emit(data);
    }


    protected doGetEvent(event: number|string|symbol){
        const subEvent = new SubEvent({});
        return subEvent;
    }
    

    public addMessageListener(event: string | number | symbol | (string | number | symbol)[], listener: SubFunction<any>){

        var events: (number|string|symbol)[];
        
        if(!Array.isArray(event))
            event = [event];
        events = event;

        for(event of events){
            if(!(event in this.events)){
                this.events[event] = this.doGetEvent(event);
            }
            const subEvent = this.events[event];
            const substription = subEvent.subscribe(listener);
        }
    }

}


export class QueryableMessageBus<T,R> extends MessageBus<T>{
    async query(event: string | number | symbol,message: T, stamps: any[]): Promise<R>{

        const subEvent = super.doGetEvent(event);

        return subEvent.toPromise()
    }
};
