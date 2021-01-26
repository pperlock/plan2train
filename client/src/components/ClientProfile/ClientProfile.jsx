import React from 'react';
import './ClientProfile.scss';
import axios from 'axios';

import List from '../../components/List/List';

// props = currentClient
class ClientProfile extends React.Component {
 
    state={currentClient:this.props.currentClient}

    componentDidMount(){
        // this.setState({currentClient: this.props.clients.find(client=>client.userId === this.props.match.params.clientId)})
    }

    componentDidUpdate(){
        // console.log("client - did update")
        this.state.currentClient.userId !==this.props.match.params.clientId && this.setState({currentClient: this.props.clients.find(client=>client.userId === this.props.match.params.clientId)});
    }

    addNote=(event)=>{
        event.preventDefault();
        const newNote={message:event.target.newNote.value};

        axios.post(`http://localhost:8080/client/${this.state.currentClient.userId}/addNote`, newNote)
        .then(res =>{
            console.log(res.data);
            const copyClient = {...this.state.currentClient};
            copyClient.notes.push(res.data);
            this.setState({currentClient:copyClient});
            event.target.newNote.value="";
            this.props.updateTrainer();
        })
        .catch(err=>{
            console.log(err);
        })

    }

    deleteNote=(noteId)=>{
        axios.delete(`http://localhost:8080/client/${this.state.currentClient.userId}/${noteId}/deleteNote`)
        .then(res =>{
            console.log(noteId);
            const copyClient = {...this.state.currentClient};
            copyClient.notes = res.data;
            this.setState({currentClient:copyClient});
            this.props.updateTrainer();
        })
        .catch(err=>{
            console.log(err);
        })
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
                        {this.state.currentClient.notes.map(note=> 
                            <List 
                                key={note.id} 
                                content={note.message} 
                                id={note.id} 
                                deleteFunction = {this.deleteNote} 
                                deleteBtn={true}
                                deleteType="modal"
                            />)}
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
