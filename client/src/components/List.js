import React from 'react';
import Header from '../components/Header';
import Footer from '../components/footer';
import '../static/css/list.css';
import { category } from '../config/category';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            category1: category,
            length: [1, 2, 3]
        };
    }
    componentDidMount() {
        let path = this.props.match.params.category;
        let path2 = this.props.match.params.city;
        //console.log(path2)
        //console.log(this.props);
        console.log(this.props.match.params.category);
        if (path) {
            axios.get('http://localhost:5000/item/?category=' + path)
                .then((res) => {
                    this.setState({ data: res.data });
                }).catch(err => console.error(err))
        } else {
            axios.get('http://localhost:5000/item/cities/?city=' + path2)
                .then((res) => {
                    this.setState({ data: res.data });
                }).catch(err => console.error(err))

        }
    }
    render() {

        return (

            <div>
                <div className="container">
                    <Header />
                    {/* <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item active" aria-current="page">Home</li>
                        </ol>
                    </nav>
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#">Home</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Library</li>
                        </ol>
                    </nav>

                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#">Home</a></li>
                            <li class="breadcrumb-item"><a href="#">Library</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Data</li>
                        </ol>
                    </nav> */}


                    {/* <div id="categories"  className="row">
                        {
                            this.state.category1.map((item) => {
                                return (
                                    <div className="col-md-3" key={item.cate}>
                                        <NavLink to=''><p id="cate-ad">{item.cate} <span style={{ color: 'red' }}>({})</span></p></NavLink>
                                    </div>

                                );
                            })
                        }

                    </div> */}
                    <hr />
                    {
                        this.state.data.length === 0 ? <NoAd /> : <ListItem data={this.state.data} />
                    }
                </div>

                <Footer />
            </div>

        );
    }
}

const ListItem = (props) => (
    <div>
        {
            props.data.map((item) => {
                return (
                    <NavLink to={`/item/${item._id}`} key={item._id}>
                        <div className="row">
                            <div id="list">
                                <div id="item-img">
                                    <img src={'http://localhost:5000/uploads/' + item.photo[0]} alt="List-Item" height='120' id="img" />

                                </div>
                                <div id="item-detail">
                                    <p id="product-name">{item.title}</p>
                                    <p id="product-cate">{item.category}</p>
                                    <p id="seller-location">{item.city}</p>
                                    <p id="product-price"><span>Rs.</span>{item.price}</p>


                                </div>
                                <div id="item-icon">
                                    <i className="far fa-heart" ></i>
                                </div>


                            </div>
                        </div>
                    </NavLink>



                );

            })
        }


    </div>
)

const NoAd = () => (
    <div style={{ margin: '50px auto', width: '80%', borderRadius: '20px', height: '300px' }}>
        <img src={require('../assests/empty.png')} alt="Empty" height="150" width="150"
            style={{ margin: '10px auto', display: 'block' }} />
        <h4 style={{ textAlign: 'center', color: 'gray' }}>Sorry :( There is no Ads</h4>

    </div>
)



export default List;