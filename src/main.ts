import {EmitteryEventDispatcher, type EventDispatcher}  from "./Dispatcher";


function factory(...args: any[]){
    return new EmitteryEventDispatcher(...args);
};

export {
    type EventDispatcher,
    EmitteryEventDispatcher,
    factory,
};

