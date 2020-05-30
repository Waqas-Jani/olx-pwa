import React from 'react';
import '../../static/css/updatepro.css';
import axios from 'axios';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import { isEmail } from 'validator';
import NotificationSystem from 'react-notification-system';

const _userdata = JSON.parse(localStorage.getItem('UserObject'));


const required = (value, props) => {
    if (!value || (props.isCheckable && !props.checked)) {
        return <span className="form-error is-visible">Required</span>;
    }
};

const email = (value) => {
    if (!isEmail(value)) {
        return <span className="form-error is-visible">${value} is not a valid email.</span>;
    }
};

const isEqual = (value, props, components) => {
    const bothUsed = components.password[0].isUsed && components.confirm[0].isUsed;
    const bothChanged = components.password[0].isChanged && components.confirm[0].isChanged;

    if (bothChanged && bothUsed && components.password[0].value !== components.confirm[0].value) {
        return <span className="form-error is-visible">Passwords are not equal.</span>;
    }
};


class UpdateProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            confirm: '',
            error: ''

        };
    }

    _notificationSystem = null

    _addNotification = (level, msg) => {
        //event.preventDefault();
        this._notificationSystem.addNotification({
            message: msg,
            level: level
        });
    }

    componentDidMount() {
        this._notificationSystem = this.refs.notificationSystem;

    }

    getUpdate = (e) => {
        e.preventDefault();
        let id = _userdata._id;
        axios.put('http://localhost:5000/user/update/' + id, this.state).then(res => {
            this._addNotification("success", "You have successfully Updated.");
            // localStorage.setItem("UserObject", JSON.stringify(res.data));
            localStorage.removeItem('UserObject');
            window.location = '/user/login'
        })
            .catch(err => {
                console.error(err.response);
                var errors = err.response.data.errors === undefined ? [] : err.response.data.errors;

                for (var i = 0; i < errors.length; i++) {
                    this._addNotification("error", `${i + 1} -> ${errors[i].param}: ${errors[i].msg}`)
                }


            });

    }

    render() {
        return (
            <div>
                <div className="container">

                    <div id="updatearea">
                        <p style={{ fontWeight: 'bold' }}>Update an Account</p>
                        <div>

                            <Form onSubmit={this.getUpdate}>

                                <div className="form-group">
                                    <input type="text"
                                        value={this.state.name}
                                        onChange={(e) => { this.setState({ name: e.target.value }) }}
                                        className="form-control" name="name" id="name"
                                        placeholder="New Name" />
                                </div>
                                <div className="form-group">
                                    <Input type="email" className="form-control"
                                        value={this.state.email}
                                        onChange={(e) => { this.setState({ email: e.target.value }) }}
                                        name="email" id="Email1"
                                        validations={[required, email]}
                                        aria-describedby="emailHelp" placeholder="New Email" />
                                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                </div>

                                <div className="form-group">
                                    <Input type="password"
                                        value={this.state.password}
                                        onChange={(e) => { this.setState({ password: e.target.value }) }}
                                        className="form-control" name="password" id="password1"
                                        validations={[required, isEqual]}
                                        placeholder="New Password" />
                                </div>
                                <div className="form-group">
                                    <Input type="password"
                                        value={this.state.password2}
                                        onChange={(e) => { this.setState({ confirm: e.target.value }) }}
                                        className="form-control" name="confirm"
                                        validations={[required, isEqual]}
                                        id="repeatpassword" placeholder="Confirm New Password" />
                                </div>


                                <button type="submit" className="btn btn-outline-primary" >Update</button>
                                &nbsp;
                                <button type="submit" className="btn btn-outline-danger"
                                    onClick={() => this.props.cancel()}
                                >Cancel</button>



                            </Form>

                        </div>

                    </div>
                </div>
                <NotificationSystem ref="notificationSystem" />

            </div>

        );
    }
}

export default UpdateProfile;