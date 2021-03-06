import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import LateralMenu from '../lateralMenu';
import Form from './form';
import {showModal} from "../../modal/actions";
import Loading from '../../loading';
import ErrorMessage from '../../errorMessage';
import ItemNotFound from '../../itemNotFound';
import {fetchModel, saveModel, verifyEmail} from "./actions";
import {MODAL_EMAIL_VERIFICATION_ERROR, MODAL_EMAIL_VERIFICATION_SUCCESS, MODAL_SAVED} from "../../modal/constants";

import TitleComponent from "../../titleComponent";
import { PROFILE_NAME } from "./constants";
import { SHOW } from "./constants";

import {
    getDefaultModel,
    getDefaultModelErrorMessage,
    getDefaultModelIsFetching,
    getErrorMessage,
    getIsFetching
} from "../selectors";
import {FormattedMessage} from 'react-intl';

/*
* Responsabilita'
* - Get form's initial values from redux state here
* - pass initial values to form
* - dispatch the action to save the model
* */

class ProfileEmails extends Component {

    componentDidMount() {
        const {fetchModel} = this.props;
        fetchModel();
    }

    // Convert form values to API model
    createModelToSave(values) {

        //clone obj
        let model = Object.assign({}, values);

        return model;
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {model} = this.props;

        if (!model) {
            return {};
        }

        let v = {};

        // convert Emails for redux-form
        v.emails = (Array.isArray(model.emails) && model.emails.length > 0) ?
            model.emails :
            [{}];

        return v;
    }

    onSubmit(values) {
        const {showModal, saveModel, model} = this.props;
        const modelToSave = this.createModelToSave(values);

        // Add auth user _id
        modelToSave._id = model._id;

        //dispatch the action to save the model here
        return saveModel(modelToSave)
            .then((model) => {
                if (model && model.id) {
                    showModal({
                        type: MODAL_SAVED
                    });
                }
            });
    }

    verifyEmail(values) {
        const {showModal, verifyEmail} = this.props;

        return verifyEmail(values)
            .then(() => {
                showModal({
                    type: MODAL_EMAIL_VERIFICATION_SUCCESS
                });
            })
            .catch(() => {
                showModal({
                    type: MODAL_EMAIL_VERIFICATION_ERROR
                });
            });
    }

    render() {

        const {model = {}, showModal, isFetching, errorMessage} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu/>
                </div>
                <div className="col-md-10">
                    {isFetching && !model && <Loading/>}

                    {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                    {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                    <TitleComponent title={model.stagename} type={PROFILE_NAME} link={"/"+model.slug} show={SHOW} />

                    <Form
                        initialValues={this.getInitialValues()}
                        onSubmit={this.onSubmit.bind(this)}
                        showModal={showModal}
                        verifyEmail={this.verifyEmail.bind(this)}
                        model={model}
                    />}
                </div>
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    model: getDefaultModel(state),
    isFetching: getDefaultModelIsFetching(state),
    errorMessage: getDefaultModelErrorMessage(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchModel,
    saveModel,
    showModal,
    verifyEmail
}, dispatch);

ProfileEmails = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileEmails);

export default ProfileEmails;
