export const INC_COUNTER = "INC_COUNTER";
export const DEC_COUNTER = "DEC_COUNTER";

export interface CounterState{
    data: number;
    title: string;
}

const initialState: CounterState = {
    data: 42,
    title: 'YARC (yet another redux counter'
}

export function increment(amount = 1){
    return {
        type: INC_COUNTER,
        payload: amount
    }
}

export function decrement(amount = 1){
    return {
        type: DEC_COUNTER,
        payload: amount
    }
}

export default function counterReducer(state = initialState, action: any){
    switch (action.type) {
        case INC_COUNTER:
            return {
                ...state,
                data: state.data + action.payload
            }
        case DEC_COUNTER:
            return {
                ...state,
                data: state.data - action.payload
            }
        default:
            return state;
    }
}