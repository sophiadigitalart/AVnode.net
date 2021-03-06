import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Form from "../../../crews/members/add";

class AddMembersModal extends Component {
  render() {
    const { _id } = this.props;
    return <Form id={_id} />;
  }
}

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

AddMembersModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMembersModal);

export default AddMembersModal;
