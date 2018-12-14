import React, { Component } from "react";
import { connect } from "react-redux";
import CreateNoteControl from "../presentational/CreateNoteControl"
import { createNoteCommand } from "../../redux-actions/commands"

const mapStateToProps = (state) => ({
    userId: state.session.userId
});

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchCreateNote: (userId, noteTitle) => dispatch(createNoteCommand(userId, noteTitle))
    };
};

class CreateNoteControlContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { title } = this.state;
        this.props.dispatchCreateNote(this.props.userId, title);
        this.setState({ title: "" });
    }

    render() {
        const { title } = this.state;
        return (
            <CreateNoteControl handleSubmit={this.handleSubmit} handleChange={this.handleChange} title={title} />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateNoteControlContainer);
