import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Tasks } from '../api/tasks.js'
export default class Task extends Component {

    handlerDelete(event){
        Meteor.call('tasks.remove',this.props.task._id)
    }

    togglePrivate(event){
        Meteor.call('tasks.setPrivate',this.props.task._id, !this.props.task.private)
    }

    toggleChecked(event){
        Meteor.call('tasks.setChecked',this.props.task._id,!this.props.task.checked)
    }

    render(){
        const taskClassName = classnames({
            checked: this.props.task.checked,
            private: this.props.task.private
        })
        return (
            <li className={taskClassName}>
                <button className="delete" onClick={this.handlerDelete.bind(this)}>&times;</button>
                <input 
                    type="checkbox"
                    readOnly
                    checked={this.props.task.checked}
                    onClick={this.toggleChecked.bind(this)}
                />
                {
                    this.props.showPrivateButton ? 
                    <button
                        className="toggle-private"
                        onClick={this.togglePrivate.bind(this)}
                    >{this.props.task.private ? 'Private' : 'Public'}</button>
                    : ''
                }
                <span className="text">{this.props.task.text}</span>
            </li>
        )    
    }
}

// 属性检查
Task.propTypes = {
    task: PropTypes.object.isRequired,
    showPrivateButton: PropTypes.bool.isRequired
}