import React from 'react';
import "./Programs.scss";
import firebase from '../../firebase';

import ClientList from '../../components/ClientList/ClientList';
import GridList from '../../components/GridList/GridList';
import ModalContainer from '../../components/ModalContainer/ModalContainer';

/**
 *  programs={this.state.programs} 
    currentProgramId={match.params.programId} 
    match={match}
    addProgram={this.addProgram}
    addResource={this.addResource} 
 */

/**
 * Props Passed in by Trainer
 * @param {Object} currentClient 
 * @param {string} currentProgramId 
 * @param {Object} match 
 * @param {function} addProgram
 * @param {function} deleteProgram
 * @param {function} addResource
 * @param {function} deleteResource
 */
 
class Programs extends React.Component {

    state={selectedFile:null, showRadio:true, uploaded:false, uploadType:""}

    componentDidUpdate(){
        console.log("programs - did update")
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
        const selectedIndex = event.target.uploadType.options.selectedIndex
        const selectedType = event.target.uploadType.options[selectedIndex].value;
        
        // if the resource to be added is a file the save it to firebase and send the resulting url to db
        if (uploadType === "file"){
            let bucketName = this.props.programs[0].trainerId;
            let file = this.state.selectedFile;
            let storageRef = firebase.storage().ref(`/${bucketName}/${file.name}`);
            let uploadTask = storageRef.put(file);
            // uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            //     ()=>{
            //         let downloadURL = uploadTask.snapshot.getDownloadURL;
            //     })
            
            let storageLoc = firebase.storage().ref();
            storageLoc.child(`/${bucketName}/${file.name}`).getDownloadURL()
            .then((url)=>{
                const newResource={
                    name:event.target.uploadName.value,
                    url:url,
                    type: selectedType
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
        this.setState({uploadType:"",  showRadio:true});
    }


    render(){
        const {programs, match, addProgram}=this.props;
        const program = programs.find(program=>program.id===match.params.programId)

        console.log(programs);


        
        return (
            <div className="programs__container" style={{backgroundImage: "url('/images/main2.jfif')"}} >
                <ClientList list={programs} match={match} onSubmitTrainer={addProgram}/>
                <div className="programs__container-right">
                    {/* <div className="program"> */}
                        <div className="component program__resources">
                            <div className="program__header">
                                <p className="program__header-title">{program.name}</p>
                                <p className="program__header-description">{program.description}</p>
                            </div>

                            <ModalContainer 
                                modalType = "delete" 
                                modalName = "delete" 
                                buttonText="Delete" 
                                buttonType="x"
                                onSubmitTrainer={this.props.deleteProgram}
                                deleteString= {program.name}
                                deleteId={program.id}
                            />

                            {program.resources.length === 0 && 
                                <div onClick={()=>this.setState({showRadio:true})} className="empty-container">
                                    <img className="empty-container__icon" src="/icons/add-icon.svg" alt="add icon"></img>
                                    <p>Click to Add Resources</p>
                                </div>}  

                        </div>   
                    {/* </div> */}
                        <div className="gridlist">
                            {program.resources.map(resource=> 
                                <GridList 
                                    key={resource.id} 
                                    content={resource.name}
                                    resourceType={resource.type} 
                                    id={resource.id} 
                                    link={resource.url} 
                                    description={resource.type} 
                                    deleteBtn={true}
                                    deleteType="modal" 
                                    deleteFunction={this.props.deleteResource}
                                />)}
                        </div>

                    <div className="resource__add">
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
                            <div className="resource__add-radios">
                                {/* clicking an input box sets which resource type options to show */}
                                <input className="resource__add-radios-button" type="radio" id="url" name="addResource" value="url" onClick={this.uploadType}/>
                                <label className="resource__add-radios-label" htmlFor="url">Add URL</label>
                                <input className="resource__add-radios-button" type="radio" id="file" name="addResource" value="file" onClick={this.uploadType}/>
                                <label className="resource__add-radios-label" htmlFor="file">Upload File</label>
                            </div>
                        }
                        
                        {(this.state.uploadType==="file" && !this.state.showRadio) &&
                            <form className="resource__upload" onSubmit={(event)=>this.fileUpload(event, this.state.uploadType)}>
                                <input className="text-input resource__upload-name" name="uploadName" type="text" placeholder="Resource Name" required></input>
                                <input className="text-input resource__upload-file" name="uploadURL" type="text" value={this.state.selectedFile.name} readOnly></input>
                                <select className="resource__upload-type" name="uploadType">
                                    <option value="pdf">pdf</option>
                                    <option value="doc">doc</option>
                                    <option value="video">video</option>
                                    <option value="image">image</option>
                                </select>
                                <button  className="resource__upload-back" onClick={()=>{ this.setState({showRadio:true})}}><img src="/icons/arrow_back-24px.svg"/></button> 
                                <button className="resource__upload-submit" type="submit">Add</button>  
                            </form>
                        }

                        {(this.state.uploadType==="url" && !this.state.showRadio) &&
                            <form className="resource__upload" onSubmit={(event)=>this.fileUpload(event, this.state.uploadType)}>
                                <input className="text-input resource__upload-name" name="uploadName" type="text" placeholder="Resource Name" required></input>
                                <input className="text-input resource__upload-file" name="uploadURL" type="text" placeholder="Enter URL" required></input>
                                <button  className="resource__upload-back" onClick={()=>{ this.setState({showRadio:true})}}><img src="/icons/arrow_back-24px.svg"/></button> 
                                <button className="resource__upload-submit" type="submit">Add</button>    
                            </form>
                        }
                    </div>
                </div>
                
            </div>
        )
    }
};

export default Programs
