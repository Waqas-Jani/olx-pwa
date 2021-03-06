import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import SubmitAdd from '../components/submitadd';
import List from '../components/List';
import Account from '../components/account';
import SingleProduct from '../components/singleProducet';
import OwnAd from '../components/ownadview';
//import UserAds from '../components/layouts/myads';

const NotFound = () => {
    return (<div>
        <h4>Page Not Found:404</h4>
    </div>
    );
}

class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/user/login' component={Login} />
                    <Route exact path='/user/register' component={Register} />
                    <Route exact path='/posting' component={SubmitAdd} />
                    <Route exact path='/myaccount/ad/update/:id' component={SubmitAdd} />
                    <Route exact path='/myaccount' component={Account} />
                    <Route exact path='/myaccount/myad/:id' component={OwnAd} />
                    <Route exact path='/item/:id' component={SingleProduct} />
                    <Route exact path='/list/:category' component={List} />
                    <Route exact path='/cities/:city' component={List} />


                    <Route exact path='*' component={NotFound} />

                </Switch>
            </Router>


        );
    }
}

export default Routes;

