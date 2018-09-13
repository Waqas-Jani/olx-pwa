import React from 'react';
import Header from './Header';
import Footer from './footer';
import MyAds from './layouts/myads';
import Profile from './layouts/profile';
//import axios from 'axios';
import Viewlater from './layouts/viewlater';
import '../static/css/account.css';
import Message from './layouts/message';


class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // componentDidMount() {
    //     const _userdata = JSON.parse(localStorage.getItem('UserObject'));
    //     let id = _userdata._id;
    //     console.log("My Account" + id);
    //     axios.get('http://localhost:5000/user/update/object/' + id).then(res => {
    //         console.log("The user data" + res.data);
    //         localStorage.setItem("UserObject", JSON.stringify(res.data));
    //     }).catch(err => console.log(err));


    // }
    render() {
        return (
            <div>
                <div className="container">
                    <Header />
                    <ul className="nav nav-tabs md-tabs nav-justified">
                        <li className="nav-item">
                            <a className="nav-link active" data-toggle="tab" href="#panel1" role="tab">Ads</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href="#panel2" role="tab">Messages</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href="#panel3" role="tab">Profile</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="tab" href="#panel4" role="tab">View later</a>
                        </li>
                    </ul>
                    <div className="tab-content card" id="tabcard">
                        <div className="tab-pane fade in show active" id="panel1" role="tabpanel">
                            <MyAds />
                        </div>

                        <div className="tab-pane fade" id="panel2" role="tabpanel">
                            <br />
                            <Message />
                        </div>

                        <div className="tab-pane fade" id="panel3" role="tabpanel">
                            <br />
                            <Profile />
                        </div>

                        <div className="tab-pane fade" id="panel4" role="tabpanel">
                            <br />
                            <Viewlater />
                        </div>

                    </div>
                </div>
                <Footer />
            </div>

        );
    }
}

export default Account;