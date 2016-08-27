import React from 'react';
import KeyResults from './Key-results-list.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from "../../../../actions/okrManagingActions.js";

class ObjectiveData extends React.Component{
  constructor(props){
    super(props);

    this.deleteObjective = this.deleteObjective.bind(this);
    this.editObjective = this.editObjective.bind(this);
  }

  editObjective(event){
    let index = this.props.objectivesList.active;
    let objective = this.props.objectivesList.visibleObjectives[index];

    if(this.props.objectivesList.editing && this.props.objectivesList.active == this.props.index){
      event.preventDefault();
      let reqBody = {};
      let objectiveDesctiption = document.querySelector("textarea.template-description").value;
      let objectiveTitle = document.querySelector("input.template-title").value;

      reqBody.description = objectiveDesctiption;
      reqBody.title = objectiveTitle;

      this.props.editObjectiveTemplate(objective._id, reqBody);
    }
    else {
      this.props.activeObjective(this.props.index);
    }
  }

  deleteObjective(){
    var result = confirm('Do you really want to delete objective?');
    if (result){
      let i = this.props.objective._id;
      this.props.deleteObjective(i, true);
    }
  }

  render() {
    let categoryId = this.props.objective.category;
    let category = this.props.categories.list.find((category) => {
      return category._id === categoryId;
    });
    
    let titleEl;
    let descriptionEl;
    let categoryEl;
    let edit;

    if (this.props.objectivesList.editing && this.props.objectivesList.active == this.props.index) {
      titleEl = (<input type='text' className='template-title' defaultValue={this.props.objective.title} />);
      descriptionEl = (<textarea className='template-description' defaultValue={this.props.objective.description} />);
      edit = 'editing';
    } else {
      titleEl = (<div className='name'>{this.props.objective.title}</div>);
      descriptionEl = (<div className='description'>{this.props.objective.description}</div>);
      edit = 'edit';
    }

		return (
      <div>
        <div className='objective-template'>
              <form onSubmit={this.editObjective}>
              <div className='edit-objective'>
                    <i className={"fi flaticon-edit " + edit} aria-hidden="true" alt='Edit' onClick={this.editObjective}></i>
                    <i className="fi flaticon-garbage-2 delete" aria-hidden="true" alt='Delete' onClick={this.deleteObjective}></i>
              </div>
              <div className='category'>{ category.title }</div>
              { titleEl }
              { descriptionEl }
            </form>     
        </div>
        <div className='key-result'><KeyResults data={this.props.objective.keyResults} /></div>
      </div>
    )
  }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

function mapStateToProps(state) {
  return {
    objectivesList: state.okrManaging,
    categories: state.categories,
  };
}

const ObjectiveDataConnected = connect(mapStateToProps, mapDispatchToProps)(ObjectiveData);
export default ObjectiveDataConnected