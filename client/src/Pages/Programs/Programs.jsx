import React from 'react';
import "./Programs.scss";
import firebase from '../../firebase';

import ClientList from '../../components/ClientList/ClientList';
import List from '../../components/List/List';

/**
 *  programs={this.state.programs} 
    currentProgramId={match.params.programId} 
    match={match}
    addProgram={this.addProgram}
    addResource={this.addResource} 
 */
class Programs extends React.Component {

    state={selectedFile:null, showRadio:false, addActivated:false, uploaded:false, uploadType:""}

    componentDidUpdate(){
        // console.log("programs - did update")
    }

    // fired by clicking on a radio button
    uploadType = (event) => {
        const type = event.target.value;
        if (type ==="file"){
                console.log( this.fileInput)
                this.fileInput.click()
        }else{
            this.setState({uploadType:type, showRadio:false})
        }
    }

    // fired through reference in uploadType - event to handle choosing a file type from file picker
    fileSelectedHandler = event =>{
        //files is an array - if they choose more than one
        this.setState({selectedFile:event.target.files[0], uploadType:"file", showRadio:false});
    }

    // fired by clicking the upload button
    fileUpload=(event,uploadType)=>{
        event.preventDefault();

        // if the resource to be added is a file the save it to firebase and send the resulting url to db
        if (uploadType === "file"){
            let bucketName = this.props.programs[0].trainerId;
            let file = this.state.selectedFile;
            let storageRef = firebase.storage().ref(`/${bucketName}/${file.name}`);
            let uploadTask = storageRef.put(file);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                ()=>{
                    let downloadURL = uploadTask.snapshot.getDownloadURL;
                })
            
            let storageLoc = firebase.storage().ref();
            storageLoc.child(`/${bucketName}/${file.name}`).getDownloadURL()
            .then((url)=>{
                const newResource={
                    name:event.target.uploadName.value,
                    url:url,
                    type:"pdf"
                }
                this.props.addResource(newResource, this.props.match.params.programId);
            })
            .catch(err=>{
                console.log(err);
            })
        //if the resource is a url then capture the url and send it to db
        }else{
            const newResource={
                name:event.target.uploadName.value,
                url:event.target.uploadURL.value,
                type:"url"
            }
            this.props.addResource(newResource, this.props.match.params.programId);
        }

        // return the add button to the screen and hide the resource input elements
        this.setState({addActivated:false, uploadType:""});
    }


    render(){
        const {programs, match, addProgram}=this.props;
        const program = programs.find(program=>program.id===match.params.programId)
        
        return (
            <div className="programs__container">
                <ClientList list={programs} match={match} onSubmitTrainer={addProgram}/>
                <div className="program">
                    <div className="component program__resources">
                        <div className="program__header">
                            <p className="program__header-title">{program.name}</p>
                            <p className="program__header-description">{program.description}</p>
                        </div>

                        <div className="list">
                                {program.resources.map(resource=> <List key={resource.id} content={resource.name} id={resource.id} link={resource.url} description={resource.type} deleteBtn={true} />)}
                        </div>

                        {/* a reference is a way to reference another element in the dom */}
                        {/* ref takes a function that binds a property of our class to a reference of this input */}        
                        {/* input box used to access the file picker */}
                        <input 
                            style={{display:'none'}} 
                            type="file"
                            // when file is selected it sets the state to the file, hides the radio and sets type of file in state
                            onChange={this.fileSelectedHandler} 
                            //input box is invisible activated by radio button choice through reference in upload type function 
                            ref={fileInput => this.fileInput=fileInput}>
                        </input>

                        {this.state.showRadio && 
                            <div>
                                {/* clicking an input box sets which resource type options to show */}
                                <input type="radio" id="url" name="addResource" value="url" onClick={this.uploadType}/>
                                <label htmlFor="url">Add URL</label>
                                <input type="radio" id="file" name="addResource" value="file" onClick={this.uploadType}/>
                                <label htmlFor="file">Upload File</label>
                            </div>
                        }
                        
                        {this.state.uploadType==="file" && 
                            <form className="resource__upload" onSubmit={(event)=>this.fileUpload(event, this.state.uploadType)}>
                                <input className="resource__upload-name" name="uploadName" type="text" placeholder="Resource Name" required></input>
                                <input className="resource__upload-file" name="uploadURL" type="text" value={this.state.selectedFile.name} readOnly></input>
                                <select className="resource__upload-type">
                                    <option value="pdf">pdf</option>
                                    <option value="doc">doc</option>
                                    <option value="video">video</option>
                                    <option value="image">image</option>
                                </select>
                                <button type="submit" className="resource__add">Upload</button>
                            </form>
                        }

                        {this.state.uploadType==="url" && 
                            <form className="resource__upload" onSubmit={(event)=>this.fileUpload(event, this.state.uploadType)}>
                                <input className="resource__upload-name" name="uploadName" type="text" placeholder="Resource Name" required></input>
                                <input className="resource__upload-file" name="uploadURL" type="text" placeholder="Enter URL"></input>
                                <button type="submit" className="resource__add">Upload</button>
                            </form>
                        }

                        {!this.state.addActivated && <button className="add resource__add" onClick={()=>this.setState({addActivated:true, showRadio:true})}>+</button>}
                        
                    </div>
                </div>
            </div>
        )
    }
};

export default Programs
