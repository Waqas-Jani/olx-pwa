import React from 'react';
import { NavLink } from 'react-router-dom';
//import {connect} from 'react-redux'
//import {changeState} from '../store/actions/action';
import '../static/css/app.css';
import Header from './Header';
import Footer from './footer';
import { category } from '../config/category';
import axios from 'axios';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            category: [],
            totalAds: '',
        };
    }
    componentDidMount() {

        axios.get('http://localhost:5000/item/total/ads')
            .then((res) => {
                this.setState({ totalAds: res.data });
                console.log(this.state.totalAds);
            }).catch(err => console.error(err))

        // Set the state and get value from input field 
        this.setState({ category: category })
        var input = document.getElementById('location');
        var options = {
            types: ['(cities)'],
            componentRestrictions: { country: "pak" }
        };
        let autoComplete = new window.google.maps.places.Autocomplete(input, options);
        autoComplete.addListener('place_changed', () => {
            var place = autoComplete.getPlace().name;
            //const upper = place.replace(/^\w/g, c => c.toUpperCase());
            const upper = this.capital(place);
            window.location = '/cities/' + upper;
            console.log(upper);

        });
    }
    capital = (str) => {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }


    render() {
        return (
            <div>
                <div id="container" className="container">
                    <Header />
                    <div id="content">
                        <div id="form-bg">
                            <div id="form-overlay">

                                <div className="row">
                                    <div className=" col-md-12 col-lg-12" id="iconform">
                                        <input type="text" className="form-control" id="location"
                                            onKeyPress={this._handleKeyPress}
                                            placeholder={`All Pakistan Ads near you: ${this.state.totalAds} `} />
                                        <i className="fa fa-map-marker-alt"></i>
                                    </div>


                                </div>

                            </div>

                        </div>
                        <div id="main-content" className="row">
                            <div id="catagory" className="col-md-11 col-sm-11 col-xs-11 col-lg-11">
                                {
                                    this.state.category.map((item, i) => {
                                        return (
                                            <NavLink to={`/list/${item.cate}`} key={item.cate}> <div id="cate-item">
                                                <img src={item.ic} alt={item.cate} height="50" width="50" />
                                                <p>{item.cate}</p>
                                            </div></NavLink>
                                        );

                                    })
                                }


                            </div>

                        </div>





                    </div>



                </div>
                <Footer />
            </div>
        );
    }
}
// function mapStateToProps(state) {
//     return({
//         userName: state.RootReducer.userName
//     })
// }

// function mapDispatchToProps(dispatch){
//     return({
//         changestateToReducer : (updatevalue)=> {
//             dispatch(changeState(updatevalue))
//         }

//     })
// }
//export default connect(mapStateToProps,mapDispatchToProps)(Home);
export default Home;