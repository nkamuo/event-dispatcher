import sprintf from 'locutus/php/strings/sprintf';
import Emittery from './Emittery';

export interface EventDispatcher{
    addListener<T>(eventName: string|symbol|number|(string|symbol|number)[],listener: (res: T) => Promise<void>|void): void;
    dispatch(eventName: string, data?: object): Promise<void>;
    query<TReturn>(eventName: string, data?: any): Promise<TReturn>;

}


export class EmitteryEventDispatcher implements EventDispatcher{

    private _emittery: Emittery;


    constructor(options = {debug: {name: 'kernel', enabled: true} }, logger?: any){

        // Emittery.isDebugEnabled = true;

        if(!options)
            options = {debug: {name: 'kernel', enabled: true} }
        this._emittery = new Emittery(options);
    }


    public addListener<T>(eventName: string|symbol|number|(string|symbol|number)[],listener: (res: T) => Promise<void>|void){
        // console.log('given-listener: ', arguments);
        this._emittery.on(eventName,listener);
    }

    public async dispatch(eventName: string, data?: object){
        
        // console.log('dispatcher-options: ', eventName, data);
        this._emittery.emit(eventName, data);
    }

    public async query<TReturn>(eventName: string, data?: any): Promise<TReturn> {

        try{
        const results = await this._emittery.emit(eventName,data);
        // console.log('results: ', results);
        if(results.length != 1)
            throw new Error(sprintf("Queriable event must be processed by just one handler; event \"%s\" was proccessed by %d",eventName,results.length));
        return results[0];
        }
        catch(error){
            console.error(error);
            throw error;
        }
    }

    public getEmittry(){
        return this._emittery;
    }
}



























// import Emittery from 'emittery';
// import { SubEvent, SubFunction } from 'sub-events';

// export interface EventDispatcher{
//     addListener<T>(event: string|symbol|number|(string|symbol|number)[],listener: (res: T) => Promise<void>|void): void;
//     dispatch(event: string, data?: object): Promise<void>;

// }


// export class EmitteryEventDispatcher implements EventDispatcher{

//     private _emittery: Emittery;


//     constructor(options = {debug: {name: 'kernel', enabled: true} }, logger: any){

//         // Emittery.isDebugEnabled = true;

//         if(!options)
//             options = {debug: {name: 'kernel', enabled: true} }
//         this._emittery = new Emittery(options);
//     }


//     public addListener<T>(event: string|symbol|number|(string|symbol|number)[],listener: (res: T) => Promise<void>|void){
//         console.log('given-listener: ', arguments);
//         this._emittery.on(event,listener);
//     }

//     public dispatch(event: string, data?: object){
        
//         console.log('dispatcher-options: ', event, data);
//         return this._emittery.emit(event, data);
//     }

//     public getEmittry(){
//         return this._emittery;
//     }
// }







// export interface IMessageBusConfig<T>{
//     bus: IMessageBus<T>;
//     async: false, 
// } 


// export interface IMessageBus<T>{
//      dispatch(event: number|string|symbol, message?: T, stamps?: any[]): Promise<any>;
// }





// // export class MessageBus<T> implements IMessageBus<T>{
    
// //     private events:{[i:string|number|symbol]: SubEvent} = {};


// //     async dispatch(event: number| string| symbol, data?: T, stamps?: any[]): Promise<void> {
// //         if(!(event in this.events))
// //             return;
// //         const subEvent = this.events[event];

// //         subEvent.emit(data);
// //     }


// //     protected doGetEvent(event: number|string|symbol){
// //         const subEvent = new SubEvent({});
// //         return subEvent;
// //     }
    

// //     public addMessageListener(event: string | number | symbol | (string | number | symbol)[], listener: SubFunction<any>){

// //         var events: (number|string|symbol)[];
        
// //         if(!Array.isArray(event))
// //             event = [event];
// //         events = event;

// //         for(event of events){
// //             if(!(event in this.events)){
// //                 this.events[event] = this.doGetEvent(event);
// //             }
// //             const subEvent = this.events[event];
// //             const substription = subEvent.subscribe(listener);
// //         }
// //     }

// // }


// // export class QueryableMessageBus<T,R> extends MessageBus<T>{
// //     async query(event: string | number | symbol,message: T, stamps: any[]): Promise<R>{

// //         const subEvent = super.doGetEvent(event);

// //         return subEvent.toPromise()
// //     }
// // };





// export class CQRSEventDispatcher<T> implements EventDispatcher{

//     private busConfigs:{[i:string]: IMessageBusConfig<T>} = {};

//     private eventToBusPatternMap = new Map<RegExp,string>();


//     private defaultBus = 'default';


//     addListener<T>(event: string | number | symbol | (string | number | symbol)[], listener: SubFunction<any>): void {

//     }

//     public dispatch(event: string | number | symbol, data?: object | undefined): Promise<void> {

//         const config = this.getEventConfig(event);
        
//         const bus = config.bus;
        
//         if(false == config.async)
//             bus.dispatch(event,data);

//         else
        
        
//     }


//     public getEventConfig(event: string | number | symbol){
//         const config = this.busConfigs[this.getBusNameForEvent(event)];


//         if(null == bus)
//             throw new Error(`Could not find bus for ${event.toString()}`);

//         return config;
        
//     }


//     private getBusNameForEvent(event: string | number | symbol): string{
        
//         for(const busPattern of this.eventToBusPatternMap.keys()){
            
//             if(busPattern.test(event.toString()))
//                 return <string>this.eventToBusPatternMap.get(busPattern);
//         }

//         return this.defaultBus;
        

//     }

// }