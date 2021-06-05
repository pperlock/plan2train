import './App.scss';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider} from 'react-dnd';


import Intro from './Pages/Intro/Intro';
import Trainer from './Pages/Trainer/Trainer';
import Programs from './Pages/Programs/Programs';
import ProgramDetails from './Pages/ProgramDetails/ProgramDetails';
import Clients from './Pages/Clients/Clients';
import SideBar from './components/SideBar/SideBar';
import ClientLessons from './Pages/ClientLessons/ClientLessons';
import ClientProfile from './Pages/ClientProfile/ClientProfile';
import Schedule from './Pages/Schedule/Schedule';

import ClientWelcome from './Pages/ClientWelcome/ClientWelcome';
import Lessons from './Pages/Lessons/Lessons';
import NextLesson from './Pages/NextLesson/NextLesson';

import TrainerProvider from './store/TrainerProvider';

const API_URL = process.env.NODE_ENV === "production" ? 'https://plan2train.herokuapp.com': 'http://localhost:5000';

function App() {
  
  return (
    <TrainerProvider value={{}}>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
              <BrowserRouter>
                <Switch>

                    <Route exact path="/" render={() => <Redirect to="/login" />} />
                    <Route path="/login" component={Intro}/>
                  
                    <>
                        <SideBar/>
                        {/* Trainer - userprofile */}
                        <Route path="/trainer/:trainerId" exact component ={Trainer}/>
                        
                        {/* Trainer - programs - no programs */}
                        <Route path="/trainer/:trainerId/programs" exact component={Programs}/>
                        {/* Trainer - programs */}
                        <Route path="/trainer/:trainerId/programs/:programId" exact component={ProgramDetails}/>
                        
                        {/* Trainer - clients - profile*/}
                        <Route path="/trainer/:trainerId/clients/:clientId/profile" exact component={ClientProfile}/>
                        {/* Trainer - clients-lessons*/}
                        <Route path="/trainer/:trainerId/clients/:clientId/lessons" exact component={ClientLessons}/> 
                        {/* Trainer - clients -  no clients */}
                        <Route path="/trainer/:trainerId/clients" exact component={Clients}/>
                        
                        {/* Trainer - schedule */}
                        <Route path="/trainer/:trainerId/schedule" component={Schedule}/>
 
                         {/* Client  - welcome*/}
                        <Route path="/client/:clientId" exact component={ClientWelcome}/>
                        {/* Client  - next lesson*/}
                        <Route path="/client/:clientId/nextlesson" exact component={NextLesson}/>
                        {/* Client  - past lessons*/}
                        <Route path="/client/:clientId/lessons/:lessonId" exact component={Lessons}/>
                        <Route path="/client/:clientId/lessons" exact component={Lessons}/>
                    </>
                    
                </Switch>
            </BrowserRouter>
        </div>
      </DndProvider>
    </TrainerProvider>
  );
}

export {App as default, API_URL};
