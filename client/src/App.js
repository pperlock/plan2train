import './App.scss';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider} from 'react-dnd';


import Intro from './Pages/Intro/Intro';
import Trainer from './Pages/Trainer/Trainer';
import Programs from './Pages/Programs/Programs';
import Client from './Pages/Client/Client';
import Clients from './Pages/Clients/Clients';
import SideBar from './components/SideBar/SideBar';
import ClientLessons from './Pages/ClientLessons/ClientLessons';
import ClientProfile from './Pages/ClientProfile/ClientProfile';

import TrainerProvider from './store/TrainerProvider';

const API_URL = process.env.NODE_ENV === "production" ? 'https://plan2train.herokuapp.com': 'http://localhost:5000';

function App() {
  
  return (
    <TrainerProvider value={{}}>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
              <BrowserRouter>
                <Switch>

                    <Route path="/" exact component={Intro}/>
                  
                    {/* Trainer - userprofile */}
                    <Route path="/trainer/:trainerId" exact render={(props)=>(<> <SideBar {...props}/> <Trainer {...props}/></>)}/>
                    {/* Trainer - programs - no programs */}
                    {/* <Route path="/trainer/:trainerId/programs" exact render={(props)=>(<> <SideBar {...props}/><Programs {...props}/></>)}/> */}
                    {/* Trainer - programs */}
                    <Route path="/trainer/:trainerId/programs/:programId" exact render={(props)=>(<> <SideBar {...props}/><Programs {...props}/></>)}/>
                    
                    {/* Trainer - clients - profile*/}
                    <Route path="/trainer/:trainerId/clients/:clientId/profile" exact render={(props)=>(<> <SideBar {...props}/><ClientProfile {...props}/></>)}/>
                    {/* Trainer - clients-lessons*/}
                    <Route path="/trainer/:trainerId/clients/:clientId/lessons" exact render={(props)=>(<> <SideBar {...props}/><ClientLessons {...props}/></>)}/> 
                    {/* Trainer - clients -  no clients */}
                    <Route path="/trainer/:trainerId/clients" exact render={(props)=>(<> <SideBar {...props}/><Clients {...props}/></>)}/>
                    
                    {/* Trainer - schedule */}
                    <Route path="/trainer/:trainerId/schedule" render={(props)=>(<Trainer {...props}/>)}/>
                    
                    {/* Client  - welcome*/}
                    <Route path="/client/:clientId" exact render={(props)=>(<Client {...props}/>)}/>
                    {/* Client  - next lesson*/}
                    <Route path="/client/:clientId/nextlesson/:lessonId" exact render={(props)=>(<Client {...props}/>)}/>
                    {/* Client  - past lessons*/}
                    <Route path="/client/:clientId/lessons/:lessonId" exact render={(props)=>(<Client {...props}/>)}/>
                    <Route path="/client/:clientId/lessons" exact render={(props)=>(<Client {...props}/>)}/>
                    
                </Switch>
            </BrowserRouter>
        </div>
      </DndProvider>
    </TrainerProvider>
  );
}

export {App as default, API_URL};
