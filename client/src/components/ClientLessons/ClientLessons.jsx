import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import './ClientLessons.scss'

import List from '../../components/List/List';
import ModalContainer from '../../components/ModalContainer/ModalContainer';

//currentClient
//programs

class ClientLessons extends React.Component {

    state={
        currentClient:this.props.currentClient,
        currentLesson: this.props.currentClient.lessons.find(lesson=>lesson.status === "current"),
        availablePrograms:this.props.programs,
        displayResources:this.props.programs[0].resources, 
        showAddNote:false, showAddHomework:false, animateBar:true
    }

    componentDidMount(){

        //gets an array of all the resource ids that have been applied to all lessons
        let allApplied = [];
        const lessons = this.state.currentClient.lessons;
        lessons.map(lesson=> lesson.resources.map(resource => allApplied.push(resource)));
        
        //adds a key for applied to each resource for all trainer programs
        const programs = this.props.programs;
        programs.map(program => program.resources.map(resource => Object.assign(resource,{applied:false})))

       
        const copyClient = {...this.props.currentClient};

        //adds the resource information for each lesson resource and adds a value of true for applied to the programs- stored only as ids in the client document in db
        this.props.programs.forEach(program=>
            program.resources.forEach(programResource=>
                copyClient.lessons.forEach(lesson => 
                    lesson.resources.forEach((resource, i)=> {
                        if(resource === programResource.id){
                            //sets a value of true for applied resources
                            programResource.applied=true;
                            //remove the single id
                            lesson.resources.splice(i,1);
                            //replace the resource with the object
                            lesson.resources.push(programResource);
                        }  
                    })
                )          
            )
        )
        
        this.setState({currentClient:copyClient, availablePrograms:programs});
        
        console.log(copyClient);
        console.log(programs);
    }

    componentDidUpdate(){
        console.log("componentUpdated")
    }

    updateResources=(program)=>{
       this.setState({displayResources:program.resources});
    
    }

    showForm=(form)=>{
        form === "note" ? this.setState({showAddNote:true}) : this.setState({showAddHomework:true});
    }

    addListItem=(event)=>{
        event.preventDefault();
        // event.stopPropagation();
        !!event.target.newNote ? this.setState({showAddNote:false}) : this.setState({showAddHomework:false});
    
        if (!!event.target.newNote){
            const newItem={message:event.target.newNote.value}
            axios.post(`http://localhost:8080/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/addNote`, newItem)
            .then(res =>{
                const lessonCopy = this.state.currentLesson;
                lessonCopy.notes = res.data;
                this.setState({currentLesson:lessonCopy});
            })
            .catch(err=>{
                console.log(err);
            })
        }else{
            const newItem={message:event.target.newHomework.value}
            axios.post(`http://localhost:8080/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/addHomework`, newItem)
            .then(res =>{
                const lessonCopy = this.state.currentLesson;
                lessonCopy.homework = res.data;
                this.setState({currentLesson:lessonCopy});
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }

    deleteListItem=(event, list)=>{
        const lessonCopy = this.state.currentLesson;
        if (list==="notes"){
            axios.delete(`http://localhost:8080/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/${event.target.id}/deleteNote`)
            .then(res =>{
                lessonCopy.notes = res.data;
                this.setState({currentLesson:lessonCopy});
            })
            .catch(err=>{
                console.log(err);
            })
        }else{
            axios.delete(`http://localhost:8080/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/${event.target.id}/deleteHomework`)
            .then(res =>{
                lessonCopy.homework = res.data;
                this.setState({currentLesson:lessonCopy});
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }
   

    updateCurrentLesson = (lessonId) =>{
        console.log(lessonId);
        const currentLesson = this.props.currentClient.lessons.find(lesson => lesson.id === lessonId);
        this.setState({currentLesson:currentLesson});
    }

    addNewLesson = () =>{
        axios.post(`http://localhost:8080/client/${this.props.currentClient.userId}/addLesson`)
            .then(res =>{
                const clientCopy = this.state.currentClient;
                console.log(clientCopy);
                clientCopy.lessons.push(res.data)
                this.setState({currentClient:clientCopy, currentLesson: res.data});
            })
            .catch(err=>{
                console.log(err);
            })
    }

    updateResources=()=>{


    }

    render(){
        //copy of state saved to variables to save time when converted to classful component
        const programs = [...this.state.availablePrograms];
        const lessons = [...this.state.currentClient.lessons];
        const currentClient = {...this.state.currentClient};
        const currentLesson = {...this.state.currentLesson};

        return (
            <div className="lessons">
                <div className="lessons__list">
                    {lessons.map(lesson =>  
                        <div id={lesson.id} key={lesson.id} className="lesson" onClick={(event)=>this.updateCurrentLesson(lesson.id)}>
                            <p className="lesson__name">{lesson.name}</p>
                            <p className="lesson__date">{lesson.date}</p>
                        </div>
                    )}
                    <p className="lessons__list-new" onClick={this.addNewLesson}> + New </p>
                </div>
                <div className="component current-lesson">
                <h2 className="component-title">{currentLesson.status !== "current" ? currentLesson.name : `${currentLesson.name} - Next Lesson`}</h2>
                    <div className = "current-lesson__top">
                        <div className="current-lesson__top-left">
                            <div className="current-lesson__top-details">
                                <p>{`Location: ${currentLesson.location}`}</p>
                                <p>{`Date: ${currentLesson.date}`}</p>
                                <p>{`Time: ${currentLesson.time}`}</p>
                                <ModalContainer 
                                    modalType = "update" 
                                    modalName = "modifyLesson" 
                                    buttonText="Update" 
                                    // onSubmitTrainer={updateClient} 
                                    information={currentLesson}
                                />
                            </div>
                            <div>Google Map</div>
                        </div>
                    </div>

                    <div className="lesson-divider"></div>

                    <h2 className="section-title section-title-resources">Resources</h2>
                    <div className="current-lesson__resources">
                        <div className="current-lesson__available">
                            {/* <p>Available Resources</p> */}
                            <div className="current-lesson__available-content">
                                <ul className="current-lesson__available-programs"> 
                                    {programs.map(program=> <Link key={program.id} to={`/clients/${currentClient.userId}/lessons`}><li onClick={()=>this.updateResources(program)} className="current-lesson__available-programs-item">{program.name}</li></Link>)}
                                </ul>

                                <div className="list current-lesson__available-resources">
                                    {this.state.displayResources.map(resource=> <List key={resource.id} content={resource.name} id={resource.id} deleteBtn={false}/>)}
                                </div>
                            </div>
                        </div>
                        <div className= "current-lesson__resources-applied">
                            <p>Lesson Resources</p>
                            {/* {lessons.map(lesson=> 
                                lesson.resources.map(resource=><List key={resource.id} content={resource.name} id={resource.id} deleteBtn={true}/>)
                            )} */}
                            {currentLesson.resources.length===0 && 
                                <div className="empty-container">
                                    <img className="empty-container__icon" src="/icons/add-icon.svg"></img>
                                    <p>Drag and Drop to Add Resources</p>
                                </div>}
                            {currentLesson.resources.map(resource=><List key={resource.id} content={resource.name} id={resource.id} deleteBtn={true}/>)}
                            

                        </div>
                    </div>

                    <div className="current-lesson__bottom">
                        <div className="current-lesson__bottom-notes">
                                <h2 className="section-title" >Notes</h2>
                                {currentLesson.notes.length===0 && 
                                <div onClick={()=> {this.showForm("note")}} className="empty-container">
                                    <img className="empty-container__icon" src="/icons/add-icon.svg"></img>
                                    <p>Click to Add Homework</p>
                                </div>}
                                {currentLesson.notes.map(note=><List key={note.id} content={note.message} id={note.id} deleteBtn={true} deleteFunction={this.deleteListItem} list="notes"/>)}
                                <form className="client__notes-form" onSubmit={(event)=>this.addListItem(event)}>
                                    {this.state.showAddNote && 
                                        <div className="current-lesson__form-input">
                                            <input className="client__notes-new" type="text" name="newNote" placeholder="New Note"></input>
                                            {/* <button type="submit" className="current-lesson__submitBtn"> Add </button> */}
                                        </div>
                                    }    
                                    {!this.state.showAddNote && <p className="current-lesson__addBtn" onClick={()=> {this.showForm("note")}}>+</p>}
                                </form>
                        </div>
                        <div className="lesson-divider"></div>

                        <div className="current-lesson__bottom-homework">
                            <h2 className="section-title">Homework</h2>
                                
                            {currentLesson.homework.length===0 && 
                                <div onClick={()=> {this.showForm("homework")}} className="empty-container">
                                    <img className="empty-container__icon" src="/icons/add-icon.svg"></img>
                                    <p>Click to Add Homework</p>
                                </div>}

                            {currentLesson.homework.map(item=><List key={item.id} content={item.message} id={item.id} deleteBtn={true} deleteFunction={this.deleteListItem} list="homework"/>)}

                            <form className="client__notes-form" onSubmit={(event)=>this.addListItem(event)}>
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
                </div>

            </div>
        )
    }
}

export default ClientLessons
