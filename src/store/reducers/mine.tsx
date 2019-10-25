import { TypeAction } from '../../typings/common'
export interface TypeMine {

}
let initialState = {

}
export default function (state: TypeMine = initialState, action: TypeAction) {
    switch (action.type) {
        default:
            return state;
    }
}