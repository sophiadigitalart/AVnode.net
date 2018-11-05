import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LateralMenu from "../lateralMenu";
import { showModal } from "../../modal/actions";
import {getDefaultModel, getDefaultModelErrorMessage, getDefaultModelIsFetching} from "../selectors";
import { fetchModel, saveModel } from "./actions";
import { getErrorMessage, getDefaultModelIsFetching } from "../../events/selectors";
import ImageForm from "../../image";
import { FormattedMessage } from "react-intl";

class CrewImage extends Component {
  render() {
    const {
      model,
      isFetching,
      match: {
        params: { _id }
      },
      errorMessage,
      fetchModel,
      saveModel
    } = this.props;

    return (
      <div className="row">
        <div className="col-md-2">
          <LateralMenu _id={_id} />
        </div>
        <div className="col-md-10">
          <h2 className="labelField">
            <FormattedMessage
              id="CrewPublicImage"
              defaultMessage="CREW IMAGE"
            />
          </h2>

          <br />

          <ImageForm
            model={model}
            isFetching={isFetching}
            errorMessage={errorMessage}
            fetchModel={fetchModel}
            saveModel={saveModel}
            id={_id}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  model: getDefaultModel(state),
  isFetching: getDefaultModelIsFetching(state),
  errorMessage: getDefaultModelErrorMessage(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchModel,
      saveModel,
      showModal
    },
    dispatch
  );

CrewImage = connect(
  mapStateToProps,
  mapDispatchToProps
)(CrewImage);

export default CrewImage;