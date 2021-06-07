import React, {useState, useContext} from 'react';
import {Link, useRouteMatch, useParams, useHistory} from 'react-router-dom';
import axios from 'axios';

import "./ClientList.scss";
import ModalContainer from '../../components/ModalContainer/ModalContainer';

import TrainerContext from '../../store/trainer-context';
import {API_URL} from '../../App.js';

function ClientList() {

    const [filter, setFilter] = useState("");
    const match = useRouteMatch();
    const {trainerId} = useParams();
    const history = useHistory();

    const {clients, setClients, programs, setPrograms} = useContext(TrainerContext);

    const searchList = (event) => {
        setFilter(event.target.value);
    }
   
    const page = match.path.split("/")[3];
   
    let filteredList = [];

    const lowercasedFilter = filter.toLowerCase();
    if (page==="clients") {
        const list = clients;
        filteredList = list.filter(item => {
            return item.userProfile['fname'].toLowerCase().includes(lowercasedFilter) || item.userProfile['lname'].toLowerCase().includes(lowercasedFilter)
        });
    }else{
        const list = programs;
        filteredList = list.filter(item => {
            return item['name'].toLowerCase().includes(lowercasedFilter)
        });
    }

    /** ================================================ ADD CLIENT ================================================*/
    const addClient = async event =>{

        event.preventDefault();

        
        const {programs:programsList, username, password, fname, lname, email, phone, address, city, province, country} = event.target;
        console.log(programsList);

        // get the list of selected programs from the selection element
        const options = programsList.options;
        let clientPrograms = [];
        for(var i=0; i < options.length; i++){
            let opt = options[i];
            const program = programs.find(program=> program.id===opt.value);
            opt.selected && clientPrograms.push(program);
        }

        // create a new client to send to the db using form input values- trainerId is applied and userid is created on the backend
        const newClient = {
            trainerId:"",
            username:username.value,
            password:password.value,
            profile:"client",
            status:"active",
            userProfile:{
                fname:fname.value,
                lname:lname.value,
                email:email.value,
                phone:phone.value,
                address:address.value,
                city: city.value,
                province: province.value,
                country: country.value
            },
            //use the selected programs from above
            programs:clientPrograms
        }
        
        // save the new client in the db and return send the user to the new client's profile page
        try{
            const res = await axios.post(`${API_URL}/trainer/${trainerId}/addClient`, newClient);
            const newClientList = [...clients, res.data];
            newClientList.sort((a,b)=>{
                if(a.userProfile.lname < b.userProfile.lname) return -1;
                if(a.userProfile.lname > b.userProfile.lname) return 1;
                return 0;
            })
            setClients(newClientList);
            history.push(`/trainer/${trainerId}/clients/${res.data.userId}/profile`)
        }catch(err){
            console.log(err);
        }
    }

    /** ================================================ ADD PROGRAM ================================================*/
    const addProgram = async event =>{

        event.preventDefault();

       //create a new program based on the information entered into the modal form - id is created on backend
       const newProgram = {
           name:event.target.programName.value,
           description:event.target.programDescription.value
       }

       try{
           const res = await axios.post(`${API_URL}/trainer/${trainerId}/addProgram`, newProgram);
           setPrograms([...programs, res.data]);
           history.push(`/trainer/${trainerId}/programs/${res.data.id}`)
       }catch(err){
           console.log(err);
       }   
   }

    return (

        <div className="client-list">
            <input className="client-list__search" type="search" placeholder="Search by Name" onChange={searchList}/>
            <div className={page==="clients" ? "client-list__add" : "client-list__add client-list__add-programs"}>
                {page === "clients" && <ModalContainer modalType="update" modalName = "addClient"  buttonType="image" url="/icons/add-user.svg" onSubmit={addClient} information={programs}/>}
                {page === "programs" && <ModalContainer modalType="update" modalName = "addProgram" buttonType="image" url="/icons/plus-square.svg" onSubmit={addProgram}/>}
            </div>

            {(clients && programs) && 
            <ul className="client-list__list">
                {page === "clients" && filteredList.map(client => 
                    <Link key={client.userId} to={`/trainer/${match.params.trainerId}/clients/${client.userId}/profile`}>
                        <li className="client-list__client">{`${client.userProfile.lname}, ${client.userProfile.fname}`}</li>
                    </Link>
                )}
                {page === "programs" && filteredList.map(item => 
                    <Link key={item.id} to ={`/trainer/${match.params.trainerId}/programs/${item.id}`}>
                        <li className="client-list__client">{`${item.name}`}</li>
                    </Link>
                )}
            </ul>}
        </div>

    )
}

export default ClientList