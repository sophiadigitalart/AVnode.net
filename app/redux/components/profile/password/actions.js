import * as api from '../../../api';
import {profile} from '../schema'
import {fetchModel as generateFetchModel, saveModel as generateSaveModel} from '../../../actions'
import * as selectors from "../selectors";
import * as constants from '../constants'

export const fetchModel = ({id} = {}) => generateFetchModel({
    selectors,
    constants,
    request: api.fetchProfilePassword,
    schema: profile,
    id
});

export const saveModel = (model) => generateSaveModel({
    selectors,
    constants,
    request: api.saveProfilePassword,
    schema: profile,
    model,
});
