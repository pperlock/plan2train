import React from 'react';
import "./Programs.scss";
import firebase from '../../firebase';

import ClientList from '../../components/ClientList/ClientList';
import List from '../../components/List/List';

class Programs extends React.Component {

    state={selectedFile:null, addActivated:false, uploaded:false, uploadType:""}

    componentDidUpdate(){
        console.log("programs - did update")
    }

    uploadType = (event) => {
        const type = event.target.value;
        console.log(type);
        if (type =="file"){
                console.log( this.fileInput)
                this.fileInput.click()
        }else{
            this.setState({uploadType:type})
        }
    }

    fileSelectedHandler = event =>{
        //files is an array - if they choose more than one
        this.setState({selectedFile:event.target.files[0], uploadType:"file"});
    }

    fileUpload=(uploadType)=>{
        if (uploadType === "file"){
            let bucketName = "resources";
            let file = this.state.selectedFile;
            let storageRef = firebase.storage().ref(`${bucketName}/${file.name}`);
            let uploadTask = storageRef.put(file);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                ()=>{
                    let downloadURL = uploadTask.snapshot.getDownloadURL;
                })
            
            
            let storageLoc = firebase.storage().ref();
            storageLoc.child('/resources/'+ this.state.selectedFile.name).getDownloadURL()
            .then((url)=>{
                console.log(url)
                const newResource={
                    name:"File Test",
                    url:url,
                    type:"pdf"
                }
                this.props.addResource(newResource, this.props.match.params.programId);
            })
            .catch(err=>{
                console.log(err);
            })
        }else{
            const newResource={
                name:"URL Test",
                url:"http://google.com",
                type:"url"
            }
            this.props.addResource(newResource, this.props.match.params.programId);
        }

        this.setState({addActivated:false, uploadType:""});
    }


    render(){
        const {programs, match, addProgram}=this.props;
        const program = programs.find(program=>program.id===match.params.programId)

        console.log(this.state.uploadType);
        
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
                                {program.resources.map(resource=> <List key={resource.id} content={resource.name} id={resource.id} link={resource.url} description={resource.type} deleteBtn={true} />)}
                        </div>

                        <input 
                            style={{display:'none'}} 
                            type="file"
                            onChange={this.fileSelectedHandler} 
                            //reference used for add button - launch the file filepicker
                            ref={fileInput => this.fileInput=fileInput}>
                        </input>

                        {this.state.addActivated && 
                            <div>
                                <input type="radio" id="url" name="addResource" value="url" onClick={this.uploadType}/>
                                <label htmlFor="url">Add URL</label>
                                <input type="radio" id="file" name="addResource" value="file" onClick={this.uploadType}/>
                                <label htmlFor="file">Upload File</label>
                            </div>
                        }
                        
                        {this.state.uploadType==="file" && 
                            <div className="resource__upload">
                                <input className="resource__upload-file" type="text" value={this.state.selectedFile.name} readOnly></input>
                                <select className="resource__upload-type">
                                    <option value="pdf">pdf</option>
                                    <option value="doc">doc</option>
                                    <option value="video">video</option>
                                    <option value="image">image</option>
                                </select>
                                <button className="resource__add" onClick={()=>this.fileUpload(this.state.uploadType)}>Upload</button>
                            </div>
                        }

                        {this.state.uploadType==="url" && 
                            <div className="resource__upload">
                                <input className="resource__upload-file" type="text" placeholder="Enter URL"></input>
                                <button className="resource__add" onClick={()=>this.fileUpload(this.state.uploadType)}>Upload</button>
                            </div>
                        }

                        {!this.state.addActivated && <button className="add resource__add" onClick={()=>this.setState({addActivated:true})}>+</button>}
                        
                    </div>
                </div>
            </div>
        )
    }
};

export default Programs
