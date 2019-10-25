import { combineReducers, ReducersMapObject, Reducer, AnyAction } from 'redux';
import { connectRouter } from 'connected-react-router';
import history from '../history';
import home from './home';
import mine from './mine';
import profile from './profile';
let reducers: ReducersMapObject = {
    home,
    mine,
    profile,
    router: connectRouter(history)
};
export type TypeRootState = {
    [key in keyof typeof reducers]: ReturnType<typeof reducers[key]>
}
let reducer: Reducer<TypeRootState, AnyAction> = combineReducers(reducers);

export default reducer;

/* function reducer(state, action) {
    return state;
}
state =
    {
        home:
} */