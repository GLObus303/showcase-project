import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import { AuthContextProvider } from './components/AuthContextProvider';
import { Header } from './components/Header';
import { Error404 } from './pages/Error404';
import { Homepage } from './pages/Homepage';
import { Login } from './pages/Login';
import { RoomDetail } from './pages/RoomDetail';
import { Admin } from './pages/Admin';
import { Create } from './pages/Create';

const App = () => (
  <Router>
    <AuthContextProvider>
      <div className="w-full h-full flex flex-col">
        <Header />

        <div className="h-full pt-16 flex-auto flex-shrink-0">
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/room/:id" component={RoomDetail} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/create" component={Create} />
            <Route path="*" component={Error404} />
          </Switch>
        </div>
      </div>
    </AuthContextProvider>
  </Router>
);

export default App;
