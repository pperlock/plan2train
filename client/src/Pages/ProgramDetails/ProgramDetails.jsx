import React, {useState, useEffect, useContext, useRef} from 'react'
import {useParams, useHistory} from 'react-router-dom';
import firebase from '../../firebase';
import axios from 'axios';

import "../Programs/Programs.scss";

import ModalContainer from '../../components/ModalContainer/ModalContainer';
import ClientList from '../../components/ClientList/ClientList';
import GridList from '../../components/GridList/GridList';
import TrainerContext from '../../store/trainer-context';

import {API_URL} from '../../App';


function ProgramDetails() {

    const {setTrainerId, programs, setPrograms} = useContext(TrainerContext);

    const {programId, trainerId} = useParams();
    const history = useHistory();

    const fileInput = useRef(null);

    //all state for uploading files
    const [selectedFile, setSelectedFile] = useState(null);
    const [showRadio, setShowRadio] = useState(true);
    const [uploadFileType, setUploadFileType] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [hideEmpty, setHideEmpty] = useState(null);
    
    const [currentProgram, setCurrentProgram] = useState(null);

    useEffect(()=>{
        !!programs && setCurrentProgram(programs.find(program=>program.id===programId));
        setTrainerId(trainerId);
    },[programId, programs, trainerId, setPrograms, setTrainerId])

    // triggered by clicking on a download type radio button
    const uploadType = (event) => {
        const type = event.target.value;
        // if the type value of the radio button is of type file the activate the file input box
        if (type ==="file"){
                fileInput.current.click()
        }else{
            //otherwise update the state with an input type of url and hide the radio buttons
            setUploadFileType(type);
            setShowRadio(false);
        }
    }

    // fired through reference in uploadType - event to handle choosing a file type from file picker
    const fileSelectedHandler = event =>{
        //files is an array - if they choose more than one - set the upload type in state to file and hide the radio buttons
        setSelectedFile(event.target.files[0]);
        setUploadFileType("file");
        setShowRadio(false);

    }

    // fired by clicking the upload button
    const fileUpload = (event, uploadType)=>{
        event.preventDefault();

        // if the resource to be added is a file the save it to firebase and send the resulting url to db
        if (uploadType === "file"){
            const selectedIndex = event.target.uploadType.options.selectedIndex
            const selectedType = event.target.uploadType.options[selectedIndex].value;
            
            let bucketName = programs[0].trainerId;
            let file = selectedFile;
            let storageRef = firebase.storage().ref(`/${bucketName}/${file.name}`);
            let uploadTask = storageRef.put(file);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                //next
                ()=>{
                    console.log("Uploading ...")
                    //show the loading icon while resource is uploading
                    setShowLoading(true);
                    setHideEmpty(true);
                },
                //error
                ()=>{
                    console.log("Upload Unsuccessful");
                },
                //complete
                async ()=>{
                    let storageLoc = firebase.storage().ref();
                    try{
                        const url = await storageLoc.child(`/${bucketName}/${file.name}`).getDownloadURL()

                        //create a new resource based using the url retrieved from storage - id is created on backend
                        const newResource={
                            name:event.target.uploadName.value,
                            url:url,
                            type: selectedType
                        }
                        //save the new resource to the database using the function passed down by the trainer component
                        addResource(newResource, programId);
                        
                        //stop showing the loading icon
                        setShowLoading(false);

                    }catch(err){
                        console.log(err);
                    }
                }   
            )

        //if the resource is a url then capture the url and send it to db
        }else{
            const newResource={
                name:event.target.uploadName.value,
                url:event.target.uploadURL.value,
                type:"url"
            }
            addResource(newResource, programId);
        }

        // return the radio buttons to the screen and hide the resource input elements
        setUploadFileType("");
        setShowRadio(true);
        setShowLoading(false);
    }


   /** ================================================ UPDATE PROGRAM ================================================*/
   const updateProgram = async event =>{

       event.preventDefault();
       
       //create a new program based on the information entered into the modal form
       const newProgram = {
           name:event.target.programName.value,
           description:event.target.programDescription.value
       }

       try{
            const res = await axios.post(`${API_URL}/program/${programId}/updateProgram`, newProgram);
            const programsCopy = [...programs];
            const programLoc = programsCopy.findIndex(program => program.id === res.data.id);
            programsCopy.splice(programLoc,1, res.data);
            setPrograms(programsCopy);
       }catch(err){
           console.log(err);
       }
       
   }

   /** ================================================ DELETE PROGRAM ================================================*/
   const deleteProgram = async programId =>{
        
       try{
            await axios.delete(`${API_URL}/program/${programId}`)
            //trigger the state to update the component and the redirect the user to the first program on the list
            const programsCopy = [...programs];
            const programLoc = programsCopy.findIndex(program => program.id === programId);
            programsCopy.splice(programLoc,1);
            setPrograms(programsCopy);
                
            //if the program removed is the only program then send the user to the empty page
            if((programs.length - 1) === 0){
                history.push(`/trainer/${trainerId}/programs`)
            }else{
                    //if the program on the list was the first on on the list send it to the program at index 1 otherwise index 0
                    const programLoc = programs.findIndex(program => program.id === programId);
                    programLoc !== 0 ? 
                    history.push(`/trainer/${trainerId}/programs/${programs[0].id}`)
                    :
                    history.push(`/trainer/${trainerId}/programs/${programs[1].id}`)
            }
       }catch(err){
           console.log(err);
       }; 
   }

   /** ================================================ ADD RESOURCE ================================================*/
   const addResource = async newResource =>{
        try{   
            //a new resources is made in the programs component and passed back to trainer to save in the db
            const res = await axios.post(`${API_URL}/program/${programId}/addResource`, newResource);
            const programCopy = {...currentProgram};
            programCopy.resources = [...programCopy.resources, res.data.resources.pop()];
            setCurrentProgram(programCopy);
        }catch(err){
            console.log(err);
        }
   }

   /** ================================================ DELETE RESOURCE ================================================*/
   const deleteResource = async resourceId =>{
       //a resourceId is sent back from the programs component and removed from the db
       try{
            await axios.delete(`${API_URL}/program/${programId}/${resourceId}`);
            const programCopy = {...currentProgram};
            const resourceLoc = programCopy.resources.findIndex(resource=>resource.id === resourceId);
            programCopy.resources.splice(resourceLoc, 1);
            setCurrentProgram(programCopy);
       }catch(err){
           console.log(err);
       } 
    }

    return (
        <div className="programs__container" style={{backgroundImage: "url('/images/main2.jfif')"}} >
            {/* render a list of clients on the page */}
            {programs && <ClientList />}
            
            {currentProgram && 
                <div className="programs__container-right">
                    <div className="component program__resources">
                        <div className="program__header">
                            <p className="component-title">{currentProgram.name}</p>
                            <p className="program__header-description">{currentProgram.description}</p>
                        </div>

                        {/* update program details */}
                        <div className="program__header-actions">
                            <div className="program__header-update">
                                <ModalContainer 
                                    modalType = "update" 
                                    modalName = "updateProgram" 
                                    buttonType="image"
                                    url="/icons/edit-icon.svg"
                                    onSubmit={updateProgram}
                                    information={currentProgram}
                                />
                            </div>

                            {/* delete program */}
                            <div className="program__header-delete">
                                <ModalContainer 
                                    modalType = "delete" 
                                    modalName = "deleteProgram" 
                                    buttonType="image"
                                    url="/icons/trash.svg"
                                    onSubmit={deleteProgram}
                                    deleteString= {currentProgram.name}
                                    deleteId={currentProgram.id}
                                />
                            </div>
                        </div>
                    </div>  

                    {/* if there are no programs added yet then show then empty container with instructions for the user */}
                    {(currentProgram.resources.length === 0 && !hideEmpty) ? 
                        <div onClick={()=>setShowRadio(true)} className="empty-container empty-resources">
                            <p>Choose a Resource Type Below to Add Resources</p>
                            {showLoading && 
                                <div className="gridlist">
                                    <div className="component grid__list-item loading"><img src="/icons/loading-icon.gif" alt="loading"/></div>
                                </div>}    
                        </div>
                        :  
                        <div className="gridlist">
                            {/* otherwise render a list of resources available for the program */}
                            {currentProgram.resources.map(resource=> 
                                <GridList 
                                    key={resource.id} 
                                    content={resource.name}
                                    resourceType={resource.type} 
                                    id={resource.id} 
                                    link={resource.url} 
                                    description={resource.type} 
                                    deleteString={resource.name}
                                    deleteBtn={true}
                                    deleteType="modal" 
                                    deleteFunction={deleteResource}
                                    modalName="deleteResource"
                                />
                            )}
                            {/* if the resource is loading show the loading icon */}
                            {showLoading && <div className="component grid__list-item loading"><img src="/icons/loading-icon.gif" alt="loading"/></div>}
                        </div>
                        }

                <div className="resource__add">
    
                    {/* input box used to access the file picker */}
                    <input 
                        style={{display:'none'}} 
                        type="file"
                        // when file is selected it sets the state to the file, hides the radio and sets type of file in state
                        onChange={fileSelectedHandler} 
                        //input box is invisible activated by radio button choice through reference in upload type function 
                        ref={fileInput}>
                    </input>

                    {/* conditionally render the radio buttons based on the state value */}
                    {showRadio && 
                        <div className="resource__add-radios">
                            {/* clicking an input box sets which resource type options to show */}
                            <input className="resource__add-radios-button" type="radio" id="url" name="addResource" value="url" onClick={uploadType}/>
                            <label className="resource__add-radios-label" htmlFor="url">Add Website</label>
                            <input className="resource__add-radios-button" type="radio" id="file" name="addResource" value="file" onClick={uploadType}/>
                            <label className="resource__add-radios-label" htmlFor="file">Upload File</label>
                        </div>
                    }
                    
                    {/* renders the appropriate text boxes and select element if the upload type is a file */}
                    {(uploadFileType==="file" && !showRadio) &&
                        <form className="resource__upload" onSubmit={(event)=>fileUpload(event, uploadFileType)}>
                            <input className="text-input resource__upload-name" name="uploadName" type="text" placeholder="Resource Name" required></input>
                            <input className="text-input resource__upload-file" name="uploadURL" type="text" value={selectedFile.name} readOnly></input>
                            <select className="resource__upload-type" name="uploadType">
                                <option value="pdf">pdf</option>
                                <option value="doc">doc</option>
                                <option value="video">video</option>
                                <option value="image">image</option>
                            </select>
                            <button  className="resource__upload-back" onClick={()=>{setShowRadio(true)}}><img src="/icons/arrow_back-24px.svg" alt="back"/></button> 
                            <button className="resource__upload-submit" type="submit">Add</button>  
                        </form>
                    }

                    {/* renders the appropriate text boxes and select element if the upload type is a url */}
                    {(uploadFileType==="url" && !showRadio) &&
                        <form className="resource__upload" onSubmit={(event)=>fileUpload(event, uploadFileType)}>
                            <input className="text-input resource__upload-name" name="uploadName" type="text" placeholder="Resource Name" required></input>
                            <input className="text-input resource__upload-file" name="uploadURL" type="text" placeholder="Enter URL" required></input>
                            <button  className="resource__upload-back" onClick={()=>{setShowRadio(true)}}><img src="/icons/arrow_back-24px.svg" alt="back"/></button> 
                            <button className="resource__upload-submit" type="submit">Add</button>    
                        </form>
                    }
                </div>
            </div>
            }
        </div>
    )
}

export default ProgramDetails
