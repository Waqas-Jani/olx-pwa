import React from 'react';
import logo from '../assests/olx-logo.png';
import '../static/css/app.css';
class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div id="footer">

                <div id="footer-detail">
                    <img src={logo} alt="Logo" id="flogo" style={{maxWidth:'60px', maxHeight:'60px'}} />
                    <div id="fterm">
                        <ul>
                            <a href="#"><li>Location</li></a>
                            <a href="#"><li>Popular</li></a>
                            <a href="#"><li>Term & Condiiton</li></a>
                        </ul>
                    </div>
                    <div id="flink">
                        <ul>
                            <a href="http://www.facebook.com"><li>Facebook</li></a>
                            <a href="http://www.twitter.com"><li>Twitter</li></a>
                            <a href="http://www.youtube.com"><li>Youtube</li></a>
                        </ul>
                    </div>
                </div>


            </div>


        );
    }
}

export default Footer;