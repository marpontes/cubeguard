import React, { Component } from 'react';
import styles from './EndpointSelect.styles';
import { withStyles } from '@material-ui/core/styles';

import {
  List, ListItem, ListItemText, MenuItem, Menu
} from '@material-ui/core';

class EndpointSelect extends Component {
  state = {
    anchorEl: null,
    selectedIndex: null,
  };

  button = undefined;

  handleClickListItem = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, anchorEl: null });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    if (this.props.endpoints === null) return <div></div>;
    return (
      <div className={classes.root}>
        <List component="nav">
          <ListItem dense
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            onClick={this.handleClickListItem}
          >
            <ListItemText 
              classes={{primary: classes.listItemText}}
              primary={this.state.selectedIndex === null ? "Default" : this.props.endpoints[this.state.selectedIndex]}
              secondary="Endpoint"
            />
          </ListItem>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {this.props.endpoints.map((option, index) => (
            <MenuItem dense
              key={option}
              selected={index === this.state.selectedIndex}
              onClick={event => this.handleMenuItemClick(event, index)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

function mapStateToProps({ config }) {
  return { config };
}

export default withStyles(styles)(EndpointSelect);