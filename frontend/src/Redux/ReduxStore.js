import {configureStore} from '@reduxjs/toolkit'
import ReduxSliceReducer from './ReduxSlice';
const ReduxStore = configureStore({
    reducer : {
        Instagram:ReduxSliceReducer
    }
});
export default ReduxStore