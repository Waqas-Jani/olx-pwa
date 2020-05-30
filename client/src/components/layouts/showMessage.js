import React from 'react'

import axios from 'axios'
class Messages extends React.Component {
    state = {
        postID: this.props.postID,
        name: '',
        contact: '',
        message: '',
        messageData: [],


    }

    componentDidMount() {
        axios.get('http://localhost:5000/item/showMessage?postID=' + this.props.postID)
            .then((response) => {
                this.setState({ messageData: response.data })
            })
            .catch((err) => {
            })
    }
    deleteMessage = (id) => {
        axios.delete('http://localhost:5000/item/deleteMessage/' + id)
            .then((response) => {
                var newList = this.state.messageData.filter(function (data) {
                    return data._id != id
                })
                this.setState({ messageData: newList })
            })
            .catch((err) => {
                console.log(err)
            })

    }

    render() {
        return (
            <div className="popup" >
                <div className="inner-popup">
                    <div className="p-3">
                        <button className="btn btn-primary my-3" onClick={this.props.click} >close</button>
                        {this.state.messageData.length > 0 ? this.state.messageData.map((data, index) => {

                            return <div key={index} className="card mb-2 p-2 message">
                                <div className="row" >
                                    <div className="col-2" >
                                        <p style={{ fontWeight: "bold", color: 'gray' }} >Name: </p>
                                        <p style={{ fontWeight: "bold", color: 'gray' }}>Contact: </p>
                                        <p style={{ fontWeight: "bold", color: 'gray' }}>Message: </p>
                                    </div>
                                    <div className="col-8">
                                        <p>
                                            {data.name}
                                        </p>
                                        <p>
                                            {data.phone}
                                        </p>
                                        <p>
                                            {data.message}
                                        </p>
                                    </div>
                                    <div className="col-1">
                                        <button className="btn btn-danger" onClick={() => this.deleteMessage(data._id)} >Delete</button>
                                    </div>


                                </div>
                            </div>
                        }) : <h5>No Message </h5>}




                    </div>
                </div>
            </div>
        )
    }
}

export default Messages;