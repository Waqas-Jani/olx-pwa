import React from 'react';
import Header from './Header';
import Footer from './footer';
import '../static/css/singleproduct.css';
import axios from 'axios';
import NotificationSystem from 'react-notification-system';

var time = new Date();
const _userId = JSON.parse(localStorage.getItem('UserObject'));
var userId = !_userId ? '' : _userId._id;
class SingleProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            mname: '',
            mphone: '',
            message: ''
        };
    }

    _notificationSystem = null;
    _addNotification = (level, msg) => {
        //event.preventDefault();
        this._notificationSystem.addNotification({
            message: msg,
            level: level
        });
    }
    componentDidMount() {
        this._notificationSystem = this.refs.notificationSystem;
        let path = this.props.match.params.id;
        axios.get('http://localhost:5000/item/item/?id=' + path)
            .then((res) => {
                this.setState({ data: res.data });
                console.log(this.state.data);
            }).catch(err => console.error(err))
    }
    // ViewLater ads function
    viewLater = () => {
        let data = this.state.data;
        if (!userId == '') {
            if (data === undefined) {
                alert("Ads is not load")
            } else {
                let _postId = data[0]._id;
                axios.post('http://localhost:5000/user/viewlater', { userId, _postId }).then(res => {
                    this._addNotification("success", "Added to View later.");
                }).catch(err => {
                    let error = err.response.data.errors[0];
                    this._addNotification("error", `${error.param}: ${error.msg}`)
                })

            }
        } else {
            this._addNotification("error", "First Login!");
        }
    }
    // Send message to seller
    sendMessage = (event) => {
        const { mname, message, mphone } = this.state;
        const _postedUserId = this.state.data !== undefined && this.state.data[0]._userId
        if (!userId == '') {
            if (mname !== '' && mphone !== '' && message !== '') {
                var msg = {
                    name: mname,
                    phone: mphone,
                    message: message,
                    userID: userId,
                    postID: this.props.match.params.id,
                    postedUserId: _postedUserId
                }
                axios.post('http://localhost:5000/item/message', { msg }).then(res => {
                    this._addNotification("success", "Message send Successfully.");
                    // window.location=`/item/${this.props.match.params.id}`
                    this.setState({
                        mname: "",
                        mphone: "",
                        message: "",
                    })
                }).catch(err => {
                    console.log("ERR", err.response);

                })
            } else {
                this._addNotification("error", "All fields required!");
            }
        } else {
            this._addNotification("error", "First Login!");
        }


    }
    // Render Function
    render() {
        const { data } = this.state;

        return (
            <div>
                <div className="container">
                    <Header />
                    <div className="row" id="product">

                        <div id="product-detail" className="col-md-8">
                            <div style={{ borderBottom: '1px solid gray', marginBottom: '5px' }}>
                                <p style={{ fontWeight: 'bold', fontSize: '17px', marginTop: '15px', paddingLeft: '5px' }}>{data !== undefined ? data[0].title : ''}</p>
                                <p style={{ marginTop: '-15px', paddingLeft: '5px', fontSize: '14px' }}><i className="fas fa-map-marker-alt"></i> <u>{data !== undefined ? data[0].city : ''} | </u><u> Added on: </u>{data !== undefined ? data[0].date : 'Not Add'} </p>
                            </div>
                            <div id="slider" className="carousel slide" data-ride="carousel">
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        {data !== undefined && <img className="d-block w-100" src={'http://localhost:5000/uploads/' + data[0].photo[0]} alt="First slide" height="450" />}
                                    </div>
                                    <div className="carousel-item ">
                                        {data !== undefined && <img className="d-block w-100" src={'http://localhost:5000/uploads/' + data[0].photo[1]} alt="Second slide" height="450" />}
                                    </div>
                                    <div className="carousel-item">
                                        {data !== undefined && <img className="d-block w-100" src={'http://localhost:5000/uploads/' + data[0].photo[2]} alt="Three slide" height="450" />}
                                    </div>
                                    <div className="carousel-item">
                                        {data !== undefined && <img className="d-block w-100" src={'http://localhost:5000/uploads/' + data[0].photo[3]} alt="Four slide" height="450" />}
                                    </div>


                                </div>
                                <a className="carousel-control-prev" href="#slider" role="button" data-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Previous</span>
                                </a>
                                <a className="carousel-control-next" href="#slider" role="button" data-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </div>
                            <hr />
                            <p>Condition: <span>{data !== undefined ? data[0].condition : ''}</span></p>
                            <b><p>Description:</p></b>
                            <p>{data !== undefined ? data[0].description : ''}</p>
                            <p style={{ color: 'gray', fontSize: '14px', fontFamily: 'calibri' }}>When you call, don't forget to mention that you found this ad on OLX.com.pk
                                I do not wish to be contacted by telemarketers or representatives of any other website.</p>

                        </div>

                        <div id="seller-detial" className="col-md-4">

                            <div id="price">
                                <button type="button" id="price-btn" >Rs.{data !== undefined ? data[0].price : ''}</button>

                            </div>
                            <div id="seller">
                                <p style={{ fontWeight: 'bold', lineHeight: '0px' }}><i className="fas fa-user-tie" style={{ color: '#777', fontSize: '30px' }}></i> &nbsp;&nbsp;{data !== undefined ? data[0].name : ''}</p>
                                <p style={{ color: 'green', lineHeight: '0px', fontSize: '11px', paddingLeft: '40px' }}>Online</p>
                                <p style={{ fontSize: '13px', paddingLeft: '40px', color: 'gray' }}>(Active on site since month)</p>
                                <p style={{ textAlign: 'center', fontSize: '18px' }}><i className="fas fa-phone"></i> {data !== undefined ? data[0].phone : ''}</p>
                            </div>
                            {
                                data !== undefined && userId !== data[0]._userId && <div id="message">
                                    <button type="button" id="msg-btn" data-toggle="modal" data-target="#exampleModal" >Message</button>
                                    <button type="button" id="view-btn" onClick={this.viewLater}>View later</button>
                                    {/* This is the model for message */}
                                    <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLabel">New message</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <form>
                                                        <div className="form-group">
                                                            <label htmlFor="recipient-name" className="col-form-label">Name</label>
                                                            <input type="text" required
                                                                value={this.state.mname}
                                                                onChange={(e) => this.setState({ mname: e.target.value })}
                                                                className="form-control" id="mname" name="mname" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="recipient-name" className="col-form-label">Phone#</label>
                                                            <input type="number" required
                                                                value={this.state.mphone}
                                                                onChange={(e) => this.setState({ mphone: e.target.value })}
                                                                className="form-control" id="mphone" name="mphone" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="message-text" className="col-form-label">Message:</label>
                                                            <textarea className="form-control" required
                                                                value={this.state.message}
                                                                onChange={(e) => this.setState({ message: e.target.value })}
                                                                id="mmessage" name="message" ></textarea>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                    <button type="button" className="btn btn-primary" onClick={this.sendMessage}>Send message</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            }

                            <div id="tips">
                                <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Safety Tips for Buyers</p>
                                <ol type="1">
                                    <li>Meet seller at a safe location</li>
                                    <li>Check the item before you buy</li>
                                    <li>Pay only after collecting item</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
                <NotificationSystem ref="notificationSystem" />
            </div>

        );
    }
}

export default SingleProduct;
