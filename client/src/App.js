import './App.scss';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider} from 'react-dnd';


import Intro from './Pages/Intro/Intro';
import Trainer from './Pages/Trainer/Trainer';
import Client from './Pages/Client/Client';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
          <BrowserRouter>
              <Switch>
                  
                  <Route path="/" exact component={Intro}/>  {/* // make an axios call to get username and id on sign in*/}
                  
                  {/* Trainer - userprofile */}
                  <Route path="/trainer/:trainerId" exact render={(props)=>(<Trainer {...props}/>)}/>
                  {/* Trainer - programs - no programs */}
                  <Route path="/trainer/:trainerId/programs" exact render={(props)=>(<Trainer {...props}/>)}/>
                  {/* Trainer - programs */}
                  <Route path="/trainer/:trainerId/programs/:programId" exact render={(props)=>(<Trainer {...props}/>)}/>
                  
                  {/* Trainer - clients - profile*/}
                  <Route path="/trainer/:trainerId/clients/:clientId/profile" exact render={(props)=>(<Trainer {...props}/>)}/>
                  {/* Trainer - clients-lessons*/}
                  <Route path="/trainer/:trainerId/clients/:clientId/lessons" exact render={(props)=>(<Trainer {...props}/>)}/>
                  {/* Trainer - clients -  no clients */}
                  <Route path="/trainer/:trainerId/clients" exact render={(props)=>(<Trainer {...props}/>)}/>
                  
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
  );
}

export default App;
