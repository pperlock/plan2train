import React from 'react';
import "./Programs.scss";
import firebase from '../../firebase';

import ClientList from '../../components/ClientList/ClientList';
import ProgramContent from '../../components/ProgramContent/ProgramContent';
import List from '../../components/List/List';

class Programs extends React.Component {

    state={selectedFile:null, addActivated:false, fileName:""}

    fileSelectedHandler = event =>{
        //files is an array - if they choose more than one
        this.setState({selectedFile:event.target.files[0], addActivated:true});
    }

    fileUpload=()=>{
        let bucketName = "resources";
        let file = this.state.selectedFile;
        console.log(file);
        let storageRef = firebase.storage().ref(`${bucketName}/${file.name}`);
        let uploadTask = storageRef.put(file);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            ()=>{
                let downloadURL = uploadTask.snapshot.getDownloadURL;
            })
        
        this.setState({addActivated:false});
        
        console.log(storageRef);
        let storageLoc = firebase.storage().ref();
        // let spaceRef = storageRef.child('/resources/'+ this.state.selectedFile.name);
        storageLoc.child('/resources/'+ this.state.selectedFile.name).getDownloadURL()
        .then((url)=>{
            console.log(url)
        })
        .catch(err=>{
            console.log(err);
        })
        
        // retrieving the file storage ref - added to another click handler - download for clients
            //let storageRef = firebase.storage().ref();
            // let spaceRef = storageRef.child('/resources/'+ this.state.files[0].name);
            // storageRef.child('/resources/'+this.state.files[0].name).getDownloadURL()
            // .then((url)=>{
            //     console.log(url)
            // })
            // .catch(err=>{
            //     console.log(err);
            // })

            //file.type = from firebase

    }

    render(){
        const {programs, match, addProgram}=this.props;
        const program = programs.find(program=>program.id===match.params.programId)
        
        return (
            <div className="programs__container">
                <ClientList list={programs} match={match} onSubmitTrainer={addProgram}/>
                {/* <ProgramContent program={programs.find(program=>program.id===match.params.programId)}/> */}
                <div className="program">
                    <div className="component program__resources">
                        <div className="program__header">
                            <p className="program__header-title">{program.name}</p>
                            <p className="program__header-description">{program.description}</p>
                        </div>

                        <div className="list">
                                {program.resources.map(resource=> <List content={resource.name} id={resource.id} description={resource.type} deleteBtn={true} />)}
                        </div>

                        <input 
                            style={{display:'none'}} 
                            type="file"
                            onChange={this.fileSelectedHandler} 
                            ref={fileInput => this.fileInput=fileInput}>
                        </input>

                        {/* <input type="text" value={this.state.selectedFile.name}></input> */}
                        {this.state.addActivated && 
                            <div className="resource__upload">
                                <input className="resource__upload-file" type="text" value={this.state.selectedFile.name} readOnly></input>
                                <select className="resource__upload-type">
                                    <option value="pdf">pdf</option>
                                    <option value="doc">doc</option>
                                    <option value="video">video</option>
                                    <option value="image">image</option>
                                </select>
                                <button className="resource__add" onClick={this.fileUpload}>Upload</button>
                            </div>
                        }
                        {!this.state.addActivated && <button className="add resource__add" onClick={()=>this.fileInput.click()}>+</button>}
                        
                    </div>
                </div>
            </div>
        )
    }
};

export default Programs
