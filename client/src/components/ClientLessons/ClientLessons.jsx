import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import './ClientLessons.scss'

import List from '../../components/List/List';

//currentClient
//programs

class ClientLessons extends React.Component {

    state={
        currentLesson: this.props.currentClient.lessons.find(lesson=>lesson.status === "current"),
        displayResources:this.props.programs[0].resources, 
        showAddNote:false, showAddHomework:false, animateBar:true
    }

    updateResources=(program)=>{
       this.setState({displayResources:program.resources});
    
    }

    showForm=(form)=>{
        form === "note" ? this.setState({showAddNote:true}) : this.setState({showAddHomework:true});
    }

    addListItem=(event, list)=>{
        event.preventDefault();
        // event.stopPropagation();
        !!event.target.newNote ? this.setState({showAddNote:false}) : this.setState({showAddHomework:false});
    
        const newItem={message:event.target.newNote.value}

        if (!!event.target.newNote){
            axios.post(`http://localhost:8080/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/addNote`, newItem)
            .then(res =>{
                // console.log(res);
                this.props.updateTrainer();
            })
            .catch(err=>{
                console.log(err);
            })
        }else{
            axios.post(`http://localhost:8080/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/addHomework`, newItem)
            .then(res =>{
                // console.log(res);
                this.props.updateTrainer();
            })
            .catch(err=>{
                console.log(err);
            })
        }

    }

    render(){
        const {programs} = this.props;
        const {lessons} = this.props.currentClient;
        const currentClient = this.props.currentClient
        const currentLesson = this.props.currentClient.lessons.find(lesson=>lesson.status === "current");
        console.log(currentLesson);
        return (
            <div className="lessons">
                <div className="component current-lesson">
                    <div className = "current-lesson__top">
                        <h2 className="component-title">Current Lesson</h2>
                        <div className="current-lesson__top-details">
                            <p>{`Name: ${currentLesson.name}`}</p>
                            <p>{`Location: ${currentLesson.location}`}</p>
                            <p>{`Date: ${currentLesson.date}`}</p>
                            <p>{`Time: ${currentLesson.time}`}</p>
                        </div>

                        <div className="current-lesson__top-notes">
                            <h2 className="section-title" >Notes</h2>
                                {currentLesson.notes.map(note=><List key={note.id} content={note.message} id={note.id} deleteBtn={true}/>)}
                            <form className="client__notes-form" onSubmit={(event)=>this.addListItem(event, currentClient)}>
                                {this.state.showAddNote && 
                                    <div className="current-lesson__form-input">
                                        <input className="client__notes-new" type="text" name="newNote" placeholder="New Note"></input>
                                        {/* <button type="submit" className="current-lesson__submitBtn"> Add </button> */}
                                    </div>
                                }    
                                {!this.state.showAddNote && <p className="current-lesson__addBtn" onClick={()=> {this.showForm("note")}}>+</p>}
                            </form>
                        </div>
                    </div>

                    <h2 className="section-title">Resources</h2>
                    <div className="current-lesson__resources">
                        <div className="current-lesson__available">
                            <p>Available Resources</p>
                            <div className="current-lesson__available-content">
                                <ul className="current-lesson__available-programs"> 
                                    {programs.map(program=> <Link key={program.id} to={`/clients/${currentClient.userId}/lessons`}><li onClick={()=>this.updateResources(program)} className="current-lesson__available-programs-item">{program.name}</li></Link>)}
                                </ul>

                                <div className="list current-lesson__available-resources">
                                    {this.state.displayResources.map(resource=> <List key={resource.id} content={resource.name} id={resource.id} deleteBtn={false}/>)}
                                </div>
                            </div>
                        </div>
                        <div className="current-lesson__resources-applied">
                            <p>Lesson Resources</p>
                            {/* {lessons.map(lesson=> 
                                lesson.resources.map(resource=><List key={resource.id} content={resource.name} id={resource.id} deleteBtn={true}/>)
                            )} */}
                            {currentLesson.resources.map(resource=><List key={resource.id} content={resource.name} id={resource.id} deleteBtn={true}/>)}

                        </div>
                    </div>

                    <div className="current-lesson__homework">
                        <h2 className="section-title">Homework</h2>
                            
                        {currentLesson.homework.map(item=><List key={item.id} content={item.message} id={item.id} deleteBtn={true}/>)}

                        <form className="client__notes-form" onSubmit={(event)=>this.addListItem(event, currentClient)}>
                                {this.state.showAddHomework && 
                                    <div className="current-lesson__form-input">
                                        <input className="client__notes-new" type="text" name="newHomework" placeholder="New Homework"></input>
                                        {/* <button className="current-lesson__submitBtn"> Add </button> */}
                                    </div>
                                }
                                {!this.state.showAddHomework && <p className="current-lesson__addBtn" onClick={()=> {this.showForm("homework")}}>+</p>}
                        </form>
                    </div>
                </div>

                <div>
                    <h2>Previous Lessons</h2>
                    <ul>
                        {lessons.map(lesson => lesson.status !=="current" && <li key={lesson.id}>{lesson.name}</li>)}
                    </ul>
                </div>
            </div>
        )
    }
}

export default ClientLessons
