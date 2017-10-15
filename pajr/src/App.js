import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const Grid = require('react-bootstrap').Grid;
const Row = require('react-bootstrap').Row;
const Col = require('react-bootstrap').Col;
const ListGroup = require('react-bootstrap').ListGroup;
const ListGroupItem = require('react-bootstrap').ListGroupItem;
const ControlLabel = require('react-bootstrap').ControlLabel;
const FormGroup = require('react-bootstrap').FormGroup;
const FormControl = require('react-bootstrap').FormControl;
const OverlayTrigger = require('react-bootstrap').OverlayTrigger;
const Popover = require('react-bootstrap').Popover;
const Panel = require('react-bootstrap').Panel;
const Button = require('react-bootstrap').Button;

const currentRequest = "Current Request"
const requestQueue = "Request Queue"

const baseEndpoint = "http://13.59.4.70:8081/"

// Logic
function popoverClickHandler (event) {
  event.preventDefault();
}

function getDurationInSeconds(unixTimestamp) {
  var date = new Date(unixTimestamp/1000);
  console.log(Date.now() - date)
  return (Date.now() - date) /1000 /60; 
}

function listsGroupInstance(items) {
  var listGroupRows = []
  if (items === undefined) {
    return <div>No data</div>
  }
  items.forEach(function(element, index) {
    listGroupRows.push(
        <OverlayTrigger trigger={index === 0 ? "" : "focus"} placement="right" overlay={itemPopover(element)}>
          <ListGroupItem className="list-group-item" onClick={popoverClickHandler} href="#">
            <div className="highlight" style={{"background-color": getHighlightColor(element.disaster.priority)}}>
            </div>
            <div className="message">
              {element.message}
            </div>
          </ListGroupItem>
        </OverlayTrigger>
    )
  }, this);
  return (
    <ListGroup>
      {listGroupRows}
    </ListGroup>
  )
}
function getHighlightColor (priority) {
  switch (priority) {
    case 0:
      return '#555555';
    case 1:
      return '#FF0000';
    case 2:
      return '#FF3333'
    case 3:
      return '#FF5555'
    case 4:
      return '#FF7777';
    case 5:
      return '#FF9999';
    case 6:
      return '#FFBBBB'
    default:
      return '#FFDDDD';
  }
}
function sortQueue(items) {
  items.sort(function(a, b) {
    if (a.disaster.priority === 0 || b.disaster.priority === 0) {
      return 0
    }
    if (a.disaster.priority < b.disaster.priority) {
      return -1
    }
    if (a.disaster.priority > b.disaster.priority) {
      return 1
    }
    if (a.disaster.priority === b.disaster.priority) {
      if (a.timestamp < b.timestamp) {
        return -1
      }
      if (a.timestamp > b.timestamp) {
        return 1
      }
    }
    return 0
  })
  console.log(items)
  return items
}

// function itemDetails(item) {
//   if (item === undefined) {
//     return <div>No data</div>
//   }
//   else {
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <Panel header="Details">
//           <FormGroup>
//             <ControlLabel>Name</ControlLabel>
//             <FormControl value={item.timestamp} />
//           </FormGroup>
//           <FormGroup>
//             <ControlLabel>Message</ControlLabel>
//             <FormControl value={item.message} />
//           </FormGroup>
//           <FormGroup>
//             <ControlLabel>priority</ControlLabel>
//             <FormControl value={item.priority} />
//           </FormGroup>
//           <Button className="pull-right">Completed</Button>
//         </Panel>
//       </form>
//     )
//   }
// }

function itemPopover(item) {
  return (
  <Popover>
    <strong>Message: </strong>
    {item.message}
    <br />
    <strong>Time Since Incident: </strong>
    {getDurationInSeconds(item.timestamp) + "seconds"}
    <br />
    <strong>Priority: </strong>
    {item.disaster.priority}
    <br />
    <strong>Disaster: </strong>
    {item.disaster.name}
    <br />
  </Popover>
  )
}


// Template
class App extends Component {

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getRequests = this.getRequests.bind(this);
    // this.setItems = this.setItems.bind(this);
    // this.setCurrentItem = this.setCurrentItem.bind(this);
    this.state = {
      items: [],
      currentItem: {}
    };
  }

  getRequests() {
    axios.get(baseEndpoint + "userRequest?status=queued").then(res => {
      console.log(res.data);
      var sorted
      var firstElement
      var restOfQueue
      sorted = sortQueue(res.data)
      if (sorted.length === 0) {
        firstElement = [];
        restOfQueue = [];
      } else if (sorted.length === 1) {
        firstElement = sorted[0];
        restOfQueue = [];
      } else {
        firstElement = sorted[0]
        restOfQueue = sorted.slice(1, sorted.length)  
      }
      this.setState({items: restOfQueue})
      this.setState({currentItem: firstElement})
    }, err => {
      console.log("error")
    });
  }

  handleSubmit(event) {
    console.log("run")  
    event.preventDefault();
    
    if (this.state.currentItem === undefined) {
      return
    }
    var sorted
    var firstElement
    var restOfQueue

    axios.put(baseEndpoint + "userRequest/" + this.state.currentItem.id + "/?status=done").then((function(res){
      console.log("start sort")
      sorted = sortQueue(this.state.items)
      if (sorted.length === 0) {
        firstElement = [];
        restOfQueue = [];
      } else if (sorted.length === 1) {
        firstElement = sorted[0];
        restOfQueue = [];
      } else {
        firstElement = sorted[0]
        restOfQueue = sorted.slice(1, sorted.length)  
      }
      this.setState({items: restOfQueue})
      this.setState({currentItem: firstElement}) 
    }).bind(this))
    .catch(function(err){
      console.log(err)
    }); 
    event.preventDefault();
  }

  componentDidMount() {
    this.getRequests();
    setInterval((function () {this.getRequests()}).bind(this), 5000);
  }

  setItems() {
    
  }

  render() {
    return (
      <div>
      <header style={{"height": "100px", "padding": "9px 0"}}className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <span style={{"font-size": "40px", "vertical-align": "middle"}}>Project PAJR</span>
        <span style={{"font-size": "48px", "margin-right": "20px", "float":"right"}}>(647) 952-5928</span>
        <span style={{"color": "#DDD","font-size": "48px", "margin-right": "20px", "float":"right"}}>Text your emergency to: </span>
      </header>
      <div className="App">
        <Grid>
          <Row>
            <Col className="container" md={3} style={{"background-color": "white"}}>
              {/* <Panel className="header" header={currentRequest}>
                {this.state.currentItem ? this.state.currentItem.message: ""}
              </Panel> */}
              <Panel className="header" header={requestQueue}>
                {listsGroupInstance(this.state.items)}
              </Panel>
            </Col>
            <Col className="container" md={9}>      
              <form onSubmit={this.handleSubmit}>
                <Panel className="header header-details" header="Current Request Details">
                    <FormGroup>
                      <Row>
                        <Col className="form-label" md={2}>
                          <ControlLabel>Disaster</ControlLabel>
                        </Col>
                        <Col md={10}>
                          <FormControl value={this.state.currentItem.disaster ? this.state.currentItem.disaster.name: ""} />
                        </Col>
                      </Row>
                    </FormGroup>
                    <FormGroup>
                      <Row>
                        <Col className="form-label" md={2}>
                          <ControlLabel>Time Since Incident</ControlLabel>
                        </Col>
                        <Col md={10}>
                          <FormControl value={this.state.currentItem.timestamp} />
                        </Col>
                      </Row>
                    </FormGroup>
                    <FormGroup>
                    <Row>
                        <Col className="form-label" md={2}>
                        <ControlLabel>Message</ControlLabel>
                        </Col>
                        <Col md={10}>
                        <FormControl value={this.state.currentItem.message} />
                        </Col>
                      </Row>
                      </FormGroup>
                      <FormGroup>
                      <Row>
                        <Col className="form-label" md={2}>
                        <ControlLabel>Priority</ControlLabel>
                        </Col>
                        <Col md={10}>
                        <FormControl value={this.state.currentItem.disaster ? this.state.currentItem.disaster.priority : ''} />
                        </Col>
                      </Row>
                      </FormGroup>
                    <Button className="pull-right" type="submit">Completed</Button>
                </Panel>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
      </div>
    );
  }
}


export default App;
