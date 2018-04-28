import {h, Component} from 'preact';
import {connect} from 'preact-redux';
import {bindActionCreators} from "redux";
import LateralMenu from '../lateralMenu'
import Form from './form'
import {showModal} from "../../modal/actions";
import Loading from '../../loading'
import ErrorMessage from '../../errorMessage'
import ItemNotFound from '../../itemNotFound';
import {getDefaultModel} from "../selectors";
import {fetchModel, saveModel} from "./actions";
import {MODAL_ADD_MEDIA, MODAL_SAVED} from "../../modal/constants";
import {getModelIsFetching, getModelErrorMessage} from "../../events/selectors";
import {Player} from 'video-react';
import "video-react/dist/video-react.css"; // import css
import {Button} from 'react-bootstrap';

class EventsImage extends Component {

    componentDidMount() {
        const {fetchModel, _id} = this.props;
        fetchModel({
            id: _id
        });
    }

    // Convert form values to API model
    createModelToSave(values) {

        //clone obj
        let model = Object.assign({}, values);

        return model;
    }

    // Modify model from API to create form initial values
    getInitialValues() {
        const {user} = this.props;

        if (!user) {
            return {};
        }

        let v = {};

        return v;
    }

    onSubmit(values) {
        const {showModal, editUser, user} = this.props;
        const model = this.createModelToSave(values);

        // Add auth user _id
        model._id = user._id;

        console.log("model", model)

        return;

        //dispatch the action to save the model here
        return editUser(model)
            .then(() => {
                showModal({
                    type: MODAL_SAVED
                });
            });
    }

    renderVideo(v, i) {
        return <div className="col-md-6" key={i}>
            <Player
                playsInline
                src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
            />
            <br/>
        </div>
    }

    render() {

        const {model, showModal, isFetching, errorMessage, _id} = this.props;

        return (
            <div className="row">
                <div className="col-md-2">
                    <LateralMenu
                        _id={_id}
                    />
                </div>
                <div className="col-md-10">
                    <h1 className="labelField">EVENT VIDEOS</h1>

                    <div className="row">
                        <div className="col-md-12">
                            <Button
                                bsStyle="success"
                                className="pull-right"
                                onClick={() => showModal({
                                    type: MODAL_ADD_MEDIA,
                                    props: {
                                        onSubmit: this.onSubmit.bind()
                                    }
                                })}>
                                <i className="fa fa-plus" data-toggle="tooltip" data-placement="top"/>
                            </Button>

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <br/>
                            {isFetching && !model && <Loading/>}

                            {errorMessage && <ErrorMessage errorMessage={errorMessage}/>}

                            {!errorMessage && !isFetching && !model && <ItemNotFound/>}

                            {!errorMessage &&
                            !isFetching &&
                            model &&
                            Array.isArray(model.videos) &&
                            model.videos.length > 0 &&
                            <div className="row">
                                {model.videos.map(this.renderVideo.bind(this))}
                            </div>}

                            {!errorMessage &&
                            !isFetching &&
                            model &&
                            Array.isArray(model.videos) &&
                            model.videos.length === 0 &&
                            <div>
                                No video to show
                            </div>}
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    model: getDefaultModel(state),
    isFetching: getModelIsFetching(state),
    errorMessage: getModelErrorMessage(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchModel,
    saveModel,
    showModal,
}, dispatch);

EventsImage = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventsImage);

export default EventsImage;
