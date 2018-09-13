import React from 'react';
import Header from './Header';
import Footer from './footer';
import '../static/css/submit.css';
import { category } from '../config/category';
import { province, cities } from '../config/pakistan';
import axios from 'axios';
import NotificationSystem from 'react-notification-system';

const _userId = JSON.parse(localStorage.getItem('UserObject'));

class SubmitAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allcategory: category,
            allprovince: province,
            allcities: cities,
            selectindex: undefined,
            condition: true,
            img1: '',
            img2: '',
            img3: '',
            img4: ''


        };
        //console.log(this.props.match.params.id);

    }
    onchange = (event) => {
        event.preventDefault();

        switch (event.target.name) {

            case 'img1':
                this.setState({ img1: event.target.files[0].name })
                break;
            case 'img2':
                this.setState({ img2: event.target.files[0].name })
                break;
            case 'img3':
                this.setState({ img3: event.target.files[0].name })
                break;
            case 'img4':
                this.setState({ img4: event.target.files[0].name })
                break;

            default:
                break;
        }


    }
    componentWillMount() {
        if (_userId === null) {

            window.location = '/user/login';
        }
    }
    // Notification

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
    // Axios Request
    postAdd = (e) => {
        e.preventDefault();
        var form = document.getElementById('addform')
        var formData = new FormData(form);
        if (this.props.match.path === '/posting') {


            axios.post('http://localhost:5000/item/ads', formData).then(res => {
                console.log(res.data);

                this._addNotification("success", "Your ad successfully upload.");
                window.location = '/';
            })
                .catch(err => {
                    console.log(err.response);
                    this._addNotification("error", "You have an error in your form please check and resubmit again.")
                });
        } else {
            let path = this.props.match.params.id;
            axios.put('http://localhost:5000/item/ads/update/?id=' + path, formData).then(res => {
                console.log(res.data);

                this._addNotification("success", "Your ad successfully updated.");
                window.location = '/';
            })
                .catch(err => {
                    console.log(err.response);
                    this._addNotification("error", "You have an error in your form please check and resubmit again.")
                });

        }

    }

    // Selected Category against result 
    selectCategory = () => {
        var selectBox = document.getElementById("selectcate");
        var selectedValue = selectBox.options[selectBox.selectedIndex].value;
        if (selectedValue === 'Animals' || selectedValue === 'Services') {
            this.setState({
                condition: false
            });
        } else {
            this.setState({
                condition: true
            })
        }


    }

    // Selected province index
    selectedindex = () => {
        var selectBox = document.getElementById("selectBox");
        var selectedValue = selectBox.options[selectBox.selectedIndex].value;

        this.setState({
            selectindex: selectedValue,
        });

    }

    //title, categoryname, price, condition, description,
    // photos, name, phone, selectprovince, selectcity
    render() {
        const { selectindex, allcities, allprovince, allcategory
        } = this.state;
        return (
            <div>
                <div id="container" className="container">
                    <Header posting={true} />
                    <div id="subbox">
                        <p>Submit an Ad</p>
                        <div id="submitform">
                            <form id="addform" encType="multipart/form-data" onSubmit={this.postAdd}>
                                <input type="hidden" name="_userId" defaultValue={_userId._id} />
                                <label><b>Ad Title</b><span style={{ color: 'red' }}>*</span></label>
                                <input type="text" id="title"
                                    className="form-control" name="title" required maxLength='70' />
                                <small id="title" className="form-text text-muted">Maximum 70 characters</small>
                                <br /><br />
                                <label><b>Category</b><span style={{ color: 'red' }}>*</span></label>
                                <select id="selectcate"
                                    onChange={this.selectCategory}

                                    className="form-control" required name="category">
                                    <option value='' >Select Category</option>
                                    {allcategory.map((item) => {
                                        return (
                                            <option value={item.cate} key={item.cate}>{item.cate}</option>
                                        );
                                    })}


                                </select>

                                <hr />

                                <label><b>Price</b><span style={{ color: 'red' }}>*</span></label>

                                <input type="text" id="price"
                                    name="price" className="form-control" placeholder="Rupees" required /><br /><br />

                                {this.state.condition ?
                                    <div>
                                        <label><b>Condition</b><span style={{ color: 'red' }}>*</span></label>
                                        <select className="form-control" id="selectcon"


                                            required name="condition">
                                            <option value=''>Choose</option>
                                            <option value='new'>New</option>
                                            <option value='used'>Used</option>
                                        </select>
                                    </div> : ''}
                                <br />
                                <label><b>Ad Description</b><span style={{ color: 'red' }}>*</span></label>
                                <textarea cols={60} rows={8}

                                    className="form-control" name="description" placeholder="Including the brand, model, age, KM's and any other accessories" required>
                                </textarea> <br /> <br />

                                <label><b>Upload Photos</b><span style={{ color: 'red' }}>*</span></label>
                                {/* <small>Ads with photos sell faster</small> */}
                                <div className="custom-file mb-3" >

                                    <input type="file" className="custom-file-input" onChange={this.onchange} name="img1" id="img1" required />
                                    <label htmlFor="img1" className="custom-file-label" >{this.state.img1}</label>
                                </div>
                                <div className="custom-file mb-3" >
                                    <input type="file" className="custom-file-input" onChange={this.onchange} name="img2" id="img2" required />
                                    <label htmlFor="img2" className="custom-file-label" >{this.state.img2}</label>
                                </div>
                                <div className="custom-file mb-3" >
                                    <input type="file" className="custom-file-input" onChange={this.onchange} name="img3" id="img3" required />
                                    <label htmlFor="img3" className="custom-file-label" >{this.state.img3}</label>
                                </div>
                                <div className="custom-file mb-3" >
                                    <input type="file" className="custom-file-input" onChange={this.onchange} name="img4" id="img4" required />
                                    <label htmlFor="img4" className="custom-file-label" >{this.state.img4}</label>
                                </div>


                                <hr />
                                <label><b>Name</b><span style={{ color: 'red' }}>*</span></label>
                                <input type="text" id="name" readOnly defaultValue={_userId.name}
                                    name="name" className="form-control" required /><br />
                                <label><b>Phone number</b><span style={{ color: 'red' }}>*</span></label>
                                <input type="text" id="phone"


                                    name="phone" className="form-control" placeholder="+92" required /><br />
                                <hr />
                                <label><b>Province</b><span style={{ color: 'red' }}>*</span></label>
                                <select id="selectBox" name="province" onChange={this.selectedindex} className="form-control" required >
                                    <option value={null}>Choose Province</option>
                                    {allprovince.map((item) => {
                                        return (
                                            <option value={item} key={item}>{item}</option>
                                        );

                                    })

                                    }
                                </select><br />

                                {(selectindex === undefined ? '' :
                                    <div>
                                        <label><b>Cities</b><span style={{ color: 'red' }}>*</span></label>

                                        <select className="form-control" id="selectcity"

                                            name="city" required>
                                            <option value=''>Choose Province</option>

                                            {selectindex !== undefined && allcities[selectindex].map((item) => {


                                                return (
                                                    <option value={item.city} key={item.city}>{item.city}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                )}
                                <p id="agreement">By clicking 'Submit' you confirm that you have carefully read and understood all the facts, statements and conditions stated in the Terms of Use & Posting Rules of our website to which you unconditionally agree and accept as true and correct and constituting a binding agreement between us.</p>
                                <hr />
                                <input type="submit" name="submit" value="Submit" className="btn btn-warning btn-lg" />
                            </form>
                        </div>

                    </div>


                </div>
                <Footer />
                <NotificationSystem ref="notificationSystem" />
            </div>

        );
    }
}

export default SubmitAdd;





// import React from 'react'

// import { Link } from 'react-router-dom'
// import Footer from './footer';
// import Header from './Header';
// import axios from 'axios';

// class SubmitAdd extends React.Component {
//     state = {
//         img1: '',
//         img2: '',
//         img3: '',
//         img4: '',
//     }

//     onchange = (event) => {
//         event.preventDefault();

//         switch (event.target.name) {

//             case 'img1':
//                 this.setState({ img1: event.target.files[0].name })
//                 break;
//             case 'img2':
//                 this.setState({ img2: event.target.files[0].name })
//                 break;
//             case 'img3':
//                 this.setState({ img3: event.target.files[0].name })
//                 break;
//             case 'img4':
//                 this.setState({ img4: event.target.files[0].name })
//                 break;

//             default:
//                 break;
//         }


//     }

//     submit = (event) => {
//         var form = document.getElementById('postad')
//         var formData = new FormData(form);

//         event.preventDefault();

//         console.log(this.state)
//         console.log('form', formData)
//         axios.post('http://localhost:5000/item/ads', formData)
//             .then((res) => {
//                 console.log(res.data);
//             })
//             .catch((err) => {
//                 console.log(err)
//             })
//     }
//     render() {
//         return (
//             <div>
//                 <div className="container" >
//                     <Header />
//                     <form action="" onSubmit={this.submit} id="postad" >
//                         <div className="card" >
//                             <div className="card-header">Submit an Ad</div>
//                             <div className="card-body px-5" >
//                                 <div className="form-group" >
//                                     <label htmlFor="addtitle">Add Title</label>
//                                     <input id="addtitle" name="addtitle" className="form-control" type="text" required />
//                                 </div>

//                                 <div className="form-group" >
//                                     <label htmlFor="category">Select Category</label>
//                                     <select name="category" className="form-control" id="category" required>
//                                         <option value="choose">Select</option>
//                                         <option value="Mobile">Mobile</option>
//                                         <option value="Labtop">Labtop</option>
//                                         <option value="Mobile">Bike</option>
//                                         <option value="Labtop">Labtop</option>

//                                     </select>
//                                 </div>

//                                 <div className="form-group" >
//                                     <label htmlFor="model">Model</label>
//                                     <input id="model" name="model" className="form-control" type="text" required />
//                                 </div>
//                                 <div className="form-group" >
//                                     <label htmlFor="category">Condition</label>
//                                     <select name="condition" className="form-control" id="category" required>
//                                         <option value="">Select</option>
//                                         <option value="New">New</option>
//                                         <option value="Used">Used</option>



//                                     </select>
//                                 </div>
//                                 <div className="form-group" >
//                                     <label htmlFor="price">Price</label>
//                                     <input id="price" name="price" className="form-control" type="text" required />
//                                 </div>
//                                 <div className="form-group" >
//                                     <label htmlFor="description">Description</label>

//                                     <textarea id="description" name="description" className="form-control" type="text" required />
//                                 </div>
//                                 <div className="custom-file mb-3" >

//                                     <input type="file" className="custom-file-input" onChange={this.onchange} name="img1" id="img1" required />
//                                     <label htmlFor="img1" className="custom-file-label" >{this.state.img1}</label>
//                                 </div>
//                                 <div className="custom-file mb-3" >
//                                     <input type="file" className="custom-file-input" onChange={this.onchange} name="img2" id="img2" required />
//                                     <label htmlFor="img2" className="custom-file-label" >{this.state.img2}</label>
//                                 </div>
//                                 <div className="custom-file mb-3" >
//                                     <input type="file" className="custom-file-input" onChange={this.onchange} name="img3" id="img3" required />
//                                     <label htmlFor="img3" className="custom-file-label" >{this.state.img3}</label>
//                                 </div>
//                                 <div className="custom-file mb-3" >
//                                     <input type="file" className="custom-file-input" onChange={this.onchange} name="img4" id="img4" required />
//                                     <label htmlFor="img4" className="custom-file-label" >{this.state.img4}</label>
//                                 </div>
//                                 <hr />
//                                 <h5>Your Contact Detail</h5>
//                                 <div className="form-group" >
//                                     <label htmlFor="Name">Name</label>
//                                     <input id="Name" name="Name" className="form-control" type="text" required />
//                                 </div>
//                                 <div className="form-group" >
//                                     <label htmlFor="phoneNumber">Phone Number</label>
//                                     <input id="phoneNumber" name="phoneNumber" className="form-control" type="text" required />
//                                 </div>
//                                 <div className="form-group" >
//                                     <label htmlFor="City">City</label>
//                                     <input id="City" name="City" className="form-control" type="text" required />
//                                 </div>
//                                 <p className="text-right" ><button className="btn btn-warning px-5 olx-btn" type="submit">Submit</button></p>
//                             </div>

//                         </div>
//                     </form>
//                 </div>
//                 <hr className="my-5" />
//                 <Footer />
//             </div>
//         )
//     }

// }

// export default SubmitAdd;