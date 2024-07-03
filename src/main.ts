import {EmitteryEventDispatcher, EventDispatcher}  from "./Dispatcher";


function factory(...args: any[]){
    return new EmitteryEventDispatcher(...args);
};

export {
    EventDispatcher,
    EmitteryEventDispatcher,
    factory,
};

