import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const Grid = require('react-bootstrap').Grid;
const Row = require('react-bootstrap').Row;
const Col = require('react-bootstrap').Col;
const ListGroup = require('react-bootstrap').ListGroup;
const ListGroupItem = require('react-bootstrap').ListGroupItem;
const ControlLabel = require('react-bootstrap').ControlLabel;
const FormGroup = require('react-bootstrap').FormGroup;
const FormControl = require('react-bootstrap').FormControl;

var items = [
    {name: "Johnny", message: "Help", disaster: "fire", status: "queue", priority: 1},
    {name: "Anthony", message: "Message 1", disaster: "Disaster 2", status: "queue", priority: 3},
    {name: "Ben", message: "Message 2", disaster: "earthquake", status: "queue", priority: 2}
  ]

// Logic
function listsGroupInstance(items) {
  var listGroupRows = []
  items.forEach(function(element) {
    listGroupRows.push(<ListGroupItem>{element.name}</ListGroupItem>)
  }, this);
  return <ListGroup>{listGroupRows}</ListGroup>
}

function itemDetails(item) {
  return (
    <form>
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
    </form>
  )
}


// Template
class App extends Component {
  render() {
    return (
      <div className="App">
        <Grid>
          <Row>
            <Col md={3} style={{"background-color": "red"}}>{listsGroupInstance(items)}</Col>
            <Col md={9}>{itemDetails(items[0])}</Col>
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
