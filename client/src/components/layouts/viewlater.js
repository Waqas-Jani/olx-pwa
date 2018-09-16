import React from 'react';
import '../../static/css/account.css';
import axios from 'axios';
import { NavLink } from 'react-router-dom';


const _userId = JSON.parse(localStorage.getItem('UserObject'));

class ViewLater extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        // this.deleteAd = this.deleteAd.bind(this);
    }

    componentDidMount() {
        
        let path = !_userId ? '' : _userId._id;
        //console.log(this.props);
        // console.log("View Later:" + path);
        //console.log(path);
        axios.get('http://localhost:5000/user/ads/viewlater/' + path)
            .then((res) => {
                this.setState({ data: res.data });
                console.log(res.data);
            }).catch(err => console.error(err))

    }
    // Delete user his ad into Whislist 
    deleteWhishlistAd(postId) {
        let userId = !_userId ? '' : _userId._id;
        console.log(postId);
        console.log(userId);
        //alert(id);
        axios.delete(`http://localhost:5000/user/whishlist/delete/${postId}/${userId}`)
            .then(res => {
                //console.log(res.data);
           
                window.location = '/myaccount'
            }).catch(err => {
                console.error(err);
            })

    }


    render() {
        return (
            <div id="myadd">
                <div id="bar">
                    <p>View Later</p>
                </div>

                {
                    this.state.data.length === 0 ? <NoAds /> : <ListItem data={this.state.data}
                        deleteWhishlistAd={this.deleteWhishlistAd}
                    />
                }





            </div>

        );
    }
}

const ListItem = (props) => {


    return (
        <div className="row">
            {
                props.data.map(item => {
                    return (
                        <div id="mylist" key={item._id}>
                            <div id="myitem-img">

                                <img src={'http://localhost:5000/uploads/' + item.photo[0]} alt="List-Item" height='120' id="img" />

                            </div>
                            <div id="myitem-detail">
                                <p id="myproduct-name">{item.title}</p>
                                <p id="myproduct-cate">{item.category}</p>
                                <p id="myproduct-price"><span>Rs.</span>{item.price}</p>


                            </div>
                            <div id="mybtn">
                                <NavLink to={`/item/${item._id}`}><button type="button" className="btn btn-primary">View</button></NavLink>
                                <button type="button" className="btn btn-danger"
                                    data-toggle="modal" data-target={`#model-${item._id}`}
                                >Delete</button>

                            </div>

                            <div className="modal fade" id={`model-${item._id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLongTitle">Remove From List</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            Are your sure want to remove ad..?
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-danger" onClick={() => props.deleteWhishlistAd(item._id)}>Confirm</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    );
                })
            }
           

        </div>


    );
}

const NoAds = () => {
    return (
        <div style={{ marginTop: '20px' }}>
            <p style={{ textAlign: 'center' }}><i className="far fa-frown" style={{ fontSize: '40px' }}></i></p>
            <p style={{ textAlign: 'center', fontSize: '20px' }}> Empty WishList</p>
        </div>
    );

}

export default ViewLater;