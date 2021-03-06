import {SAVE_MODEL_SUCCESS, SAVE_MODEL_REQUEST, SAVE_MODEL_ERROR} from './constants';
import {FETCH_LIST_ERROR, FETCH_LIST_REQUEST, FETCH_LIST_SUCCESS} from './constants';
import {FETCH_MODEL_ERROR, FETCH_MODEL_REQUEST, FETCH_MODEL_SUCCESS} from './constants';
import create from '../../reducers/byIdAndListCreator'
import {MODELS_NAME} from "./constants";

export default create({
    MODELS_NAME,
    FETCH_LIST_ERROR,
    FETCH_LIST_REQUEST,
    FETCH_LIST_SUCCESS,
    FETCH_MODEL_ERROR,
    FETCH_MODEL_SUCCESS,
    FETCH_MODEL_REQUEST,
    SAVE_MODEL_SUCCESS,
    SAVE_MODEL_REQUEST,
    SAVE_MODEL_ERROR
});