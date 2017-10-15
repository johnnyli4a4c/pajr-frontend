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

var items = [
    {name: "Johnny", message: "Help", disaster: "fire", status: "queue", priority: 1, time: Date.now()},
    {name: "Ben", message: "Message 2", disaster: "earthquake", status: "queue", priority: 4, time: Date.now() + 1000},
    {name: "Anthony", message: "Message 1", disaster: "Disaster 2", status: "queue", priority: 1, time: Date.now() + 180}
  ]

var currentItem = {name: "Johnny", message: "Help", disaster: "fire", status: "queue", priority: 1, time: Date.now()}

const currentRequest = "Current Request"
const requestQueue = "Request Queue"

// Logic
function listsGroupInstance(items) {
  var listGroupRows = []
  items.sort(function(a, b) {
    if (a.priority < b.priority) {
      return -1
    }
    if (a.priority > b.priority) {
      return 1
    }
    if (a.priority === b.priority) {
      if (a.time < b.time) {
        return -1
      }
      if (a.time > b.time) {
        return 1
      }
    }
    return 0
  })
  items.forEach(function(element, index) {
    listGroupRows.push(
        <OverlayTrigger trigger={index === 0 ? "" : "focus"} placement="right" overlay={itemPopover(element)}>
          <ListGroupItem href="#">
            {element.name}
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

function itemDetails(item) {
  return (
    <form>
      <Panel header="Details">
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <FormControl value={item.name} />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Message</ControlLabel>
          <FormControl value={item.message} />
        </FormGroup>
        <FormGroup>
          <ControlLabel>priority</ControlLabel>
          <FormControl value={item.priority} />
        </FormGroup>
        <Button className="pull-right" type="Submit">Completed</Button>
      </Panel>
    </form>
  )
}

function itemPopover(item) {
  return (
  <Popover>
    <strong>Name: </strong>
    {item.name}
    <br />
    <strong>Message: </strong>
    {item.message}
    <br />
    <strong>Priority: </strong>
    {item.priority}
    <br />
    <strong>Disaster: </strong>
    {item.disaster}
    <br />
  </Popover>
  )
}

// Template
class App extends Component {

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     items: []
  //   };
  // }

  // componentDidMount() {
  //   axios.get("http://google.com").then(res => {
  //     console.log("alert")
  //   }, err => {
  //     console.log("error")
  //   });
  // }

  render() {
    return (
      <div className="App">
        <Grid>
          <Row>
            <Col md={3} style={{"background-color": "red"}}>
              <Panel header={currentRequest}>
                {currentItem.name}
              </Panel>
              <Panel header={requestQueue}>
                {listsGroupInstance(items)}
              </Panel>
            </Col>
            <Col md={9}>{itemDetails(currentItem)}</Col>
          </Row>
        </Grid>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    );
  }
}


export default App;
