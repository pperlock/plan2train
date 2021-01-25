import React from 'react';
import './ClientProfile.scss';
import axios from 'axios';

import List from '../../components/List/List';

// props = currentClient
class ClientProfile extends React.Component {
 
    state={currentClient:this.props.currentClient}

    addNote=(event)=>{
        event.preventDefault();
        const newNote={message:event.target.newNote.value};


        axios.post(`http://localhost:8080/client/${this.state.currentClient.userId}/addNote`, newNote)
        .then(res =>{
            console.log(res.data);
            const copyClient = {...this.state.currentClient};
            copyClient.notes.push(res.data);
            this.setState({currentClient:copyClient});
        })
        .catch(err=>{
            console.log(err);
        })

    }

    deleteNote=(event)=>{
        // const lessonCopy = {...this.state.currentLesson};
        // // list variable passed in is used to determine what list to delete the item from
        // if (list==="notes"){
        //     axios.delete(`http://localhost:8080/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/${event.target.id}/deleteNote`)
        //     .then(res =>{
        //         lessonCopy.notes = res.data;
        //         this.setState({currentLesson:lessonCopy});
        //     })
        //     .catch(err=>{
        //         console.log(err);
        //     })
        // }else{
        //     axios.delete(`http://localhost:8080/client/${this.props.currentClient.userId}/${this.state.currentLesson.id}/${event.target.id}/deleteHomework`)
        //     .then(res =>{
        //         lessonCopy.homework = res.data;
        //         this.setState({currentLesson:lessonCopy});
        //     })
        //     .catch(err=>{
        //         console.log(err);
        //     })
        // }
    }

    render(){
        const {address, city, province, country, postal, email, phone} = this.state.currentClient.userProfile;
        return (
            <div className = "client__middle">
                <div className = "component client__contact">
                    <div className="client__contact-info">
                        <div className="client__contact-info-top">
                            <div className="client__contact-address"> 
                                <p className="component-title client__contact-title">Contact</p>
                                <p className="client__contact-item"> {address}</p>
                                <p className="client__contact-item"> {city}</p>
                                <p className="client__contact-item"> {`${province},  ${country}`}</p>
                                <p className="client__contact-item"> {postal}</p>
                            </div>
                            <div className="client__contact-contact">
                                <p className="client__contact-item"> {email}</p>
                                <p className="client__contact-item"> {phone}</p>
                            </div>
                        </div>
                    </div>
                    <div className="client__contact-map">google map</div>
                </div>

                <div className = "component client__notes">
                    <p className="component-title">Notes</p>
                    <div className="list">
                        {this.state.currentClient.notes.map(note=> <List key={note.id} content={note.message} id={note.id} deleteFunction = {this.deleteNote} deleteBtn={true}/>)}
                    </div>
                    <form className="client__notes-form" onSubmit={(event)=>this.addNote(event)}>
                        <input className="client__notes-new" type="text" name="newNote" placeholder="New Note"></input>
                        <button className=" add client__notes-add"> + </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default ClientProfile
