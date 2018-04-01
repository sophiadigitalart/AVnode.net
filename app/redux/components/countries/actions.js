import * as api from '../../api';
import {normalize} from 'normalizr';
import {FETCH_LIST_SUCCESS, FETCH_LIST_REQUEST, FETCH_LIST_ERROR} from './constants'
import {arrayOfCountry} from './schema'

export const fetchList = () => (dispatch) => {

    dispatch({
        type: FETCH_LIST_REQUEST,
    });

    return api.fetchCountries()
        .then(
            (response) => {
                dispatch({
                    type: FETCH_LIST_SUCCESS,
                    response: normalize(response || [], arrayOfCountry)
                });
            },
            (error) => {
                dispatch({
                    type: FETCH_LIST_ERROR,
                    errorMessage: error.message || 'Something went wrong.'
                });
            });
};