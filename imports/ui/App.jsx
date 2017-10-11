import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import PropTypes from 'prop-types'
import Task from './task.jsx'
import AccountsUiWrapper from './AccountsUIWrapper.jsx'
import { Tasks } from '../api/tasks.js'

// app全局组件
class App extends Component {

    constructor(props){
        super(props)
        this.state = {
            hideCompleted: false
        }
    }

    toggleHideCompleted(event){
        this.setState({
            hideCompleted: !this.state.hideCompleted
        })
    }

    handleSubmit(event){
        event.preventDefault()

        let text = this.refs.textInput.value.trim()
        this.refs.textInput.value = ''
        Meteor.call('tasks.insert',text)
    }

    renderTasks(){
        let filterTasks = this.props.tasks
        if(this.state.hideCompleted){
            filterTasks = filterTasks.filter(task=> !task.checked)
        }
        return filterTasks.map(task=>{
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = task.owner === currentUserId
            return <Task key={task._id} task={task} showPrivateButton={showPrivateButton} />
        })
    }

    render(){
        return (
            <div className="container">
                <h1>Todo List ({this.props.incompleteCount})</h1>
                <label className="hide-completed">
                    <input
                    type="checkbox"
                    readOnly
                    checked={this.state.hideCompleted}
                    onClick={this.toggleHideCompleted.bind(this)}
                    />
                    Hide Completed Tasks
                </label>
                <AccountsUiWrapper />
                {   this.props.currentUser ? 
                    <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
                        <input
                            type="text"
                            ref="textInput"
                            placeholder="Type to add new task"
                        />
                    </form> : ''
                 }
                 <ul>{this.renderTasks()}</ul>
            </div>
        )
    }
}

App.propTypes = {
    tasks: PropTypes.array.isRequired,
    incompleteCount: PropTypes.number.isRequired,
    currentUser: PropTypes.object
}

export default createContainer(()=>{
    Meteor.subscribe('tasks')
    return {
        tasks: Tasks.find({},{sort: { createdAt: -1 }}).fetch(),
        incompleteCount: Tasks.find({checked: { $ne: true }, owner: Meteor.userId()}).count(),
        currentUser: Meteor.user()
    }
}, App)