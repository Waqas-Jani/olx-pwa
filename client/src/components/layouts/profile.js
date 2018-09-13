import React from 'react';
import '../../static/css/account.css';
import axios from 'axios';
import UpdateProfile from './updateprofile';
//import { NavLink } from 'react-router-dom';


const _userdata = JSON.parse(localStorage.getItem('UserObject'));
class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false
        };
    }
    cancelUpdate = () => {
        this.setState({
            isEditing: false
        })
    }
    deleteAccount = (id) => {
        axios.delete('http://localhost:5000/user/delete/account/'+ id).then(res => {
            console.log("User Deleted")
            localStorage.removeItem('UserObject');
            window.location= '/'
        }).catch(err => console.log(err));
    }
    render() {
        const { isEditing } = this.state;
        return (
            <div className="container">
                <h4 className="alert alert-primary">Profile</h4>
                {
                    isEditing ? <UpdateProfile cancel={this.cancelUpdate} /> :
                        <div id="profile">
                            <div id="dp">
                                <img src={require('../../assests/profile.png')} alt="Profile" height="200" width="200" id="profiledb"/>
                            </div>
                            <div id="info">
                                <h2>{_userdata.name}</h2>
                                <h5>{_userdata.email}</h5>
                                <div id="probtn">
                                    <button type="button" className="btn btn-outline-danger" id="delete" data-toggle="modal" data-target="#exampleModal">
                                        Delete Account
                                    </button>
                                    <button type="button" className="btn btn-outline-warning" id="edit" onClick={() => {
                                        this.setState({ isEditing: true })
                                    }}>Edit Account</button>

                                </div>

                                {/* Model hidden */}
                                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Delete Account</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                Are you sure..?
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal" >Close</button>
                                                <button type="button" className="btn btn-danger" onClick={() => this.deleteAccount(_userdata._id)}>Confirm</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>

                        </div>


                }


            </div>

        );
    }
}





export default Profile;

