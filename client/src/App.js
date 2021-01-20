import './App.scss';
import {BrowserRouter, Route, Switch} from 'react-router-dom';


import Intro from './Pages/Intro/Intro';
import Trainer from './Pages/Trainer/Trainer';

function App() {
  return (
    <div className="App">

        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Intro}/>  {/* // make an axios call to get username and id on sign in*/}
                <Route path="/trainer/:username/:trainerId" render={(props)=>(<Trainer {...props}/>)}/>
                <Route path="/programs/:programId" render={(props)=>(<Trainer {...props}/>)}/>
                <Route path="/clients/:clientId/profile" exact render={(props)=>(<Trainer {...props}/>)}/>
                <Route path="/clients/:clientId/lessons" render={(props)=>(<Trainer {...props}/>)}/>
                <Route path="/schedule" render={(props)=>(<Trainer {...props}/>)}/>
            </Switch>
        </BrowserRouter>
        
    </div>
  );
}

export default App;
