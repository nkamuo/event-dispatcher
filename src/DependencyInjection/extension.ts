import ContainerBuilder, { Extension } from "@raegon/dependency-injection";
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

class CqrsSagaExtension extends Extension {
    public load(configs: { [i: string]: any; }, container: ContainerBuilder): void {


    }



    private buildRedux(configs: { [i: string]: any; }, container: ContainerBuilder) {

        const reducer = this.buildReducer(configs,container);
        const mySaga= this.buildSaga(configs,container);
        // create the saga middleware
        const sagaMiddleware = createSagaMiddleware()
        // mount it on the Store
        const store = configureStore({
            // reducer,
            middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
        })

        // then run the saga
        sagaMiddleware.run(mySaga)

    }


    private buildReducer(configs: { [i: string]: any; }, container: ContainerBuilder){
        return ;
    }

    private buildSaga(configs: { [i: string]: any; }, container: ContainerBuilder){
        return function *(){
            yield 'THE SAGA';
        };
    }

}