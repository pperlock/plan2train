import './App.scss';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {DndProvider} from 'react-dnd';


import Intro from './Pages/Intro/Intro';
import Login from './Pages/Login/Login';
import Trainer from './Pages/Trainer/Trainer';
import Client from './Pages/Client/Client';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
          <BrowserRouter>
              <Switch>
                  <Route path="/" exact component={Intro}/>  {/* // make an axios call to get username and id on sign in*/}
                  <Route path="/trainerlogin" component={Login}/>
                  <Route path="/clientlogin" component={Login}/>
                  <Route path="/trainer/:username/:trainerId/programs/:programId" exact render={(props)=>(<Trainer {...props}/>)}/>
                  <Route path="/trainer/:username/:trainerId" exact render={(props)=>(<Trainer {...props}/>)}/>
                  <Route path="/trainer/:username/:trainerId/clients/:clientId/profile" exact render={(props)=>(<Trainer {...props}/>)}/>
                  <Route path="/trainer/:username/:trainerId/clients/:clientId/lessons" exact render={(props)=>(<Trainer {...props}/>)}/>
                  <Route path="/schedule" render={(props)=>(<Trainer {...props}/>)}/>
                  <Route path="/trainer/:username/:trainerId/client/:username/:clientId" exact render={(props)=>(<Client {...props}/>)}/>

              </Switch>
          </BrowserRouter>
      </div>
    </DndProvider>
  );
}

export default App;
