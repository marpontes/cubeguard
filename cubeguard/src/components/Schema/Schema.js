import React, { Component } from 'react';
import styles from './Schema.styles';
import EndpointSelect from '../EndpointSelect/EndpointSelect';
import { withStyles } from '@material-ui/core/styles';
import CodeIcon from '@material-ui/icons/Code';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { setSchema } from '../../actions/schema';
import { getEndpoints } from '../../actions/endpoints';
import {
  Card, CardActions, CardContent,
  Button, Typography, IconButton, Switch
} from '@material-ui/core';

class Schema extends Component {

  componentDidMount(){
    this.props.getEndpoints();
  }

  handleEnable = () => {

    return event => {
      const DSP_CLASS = this.props.config["cubeguard.dspClass"];
      var newSchema = Object.assign({}, this.props.schema);

      if (!this.props.schema.enabled) {
        newSchema["data"]["DynamicSchemaProcessor"] = DSP_CLASS
        newSchema["data"]["UseContentChecksum"] = 'true';
      } else {
        delete newSchema["data"]['DynamicSchemaProcessor'];
        delete newSchema["data"]["UseContentChecksum"];
      }

      this.props.updateHandler(newSchema);
      this.props.setSchema(newSchema);

    }

  };

  handleEndpointChoice( newEndpoint ){

  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
            Schema
                </Typography>
          <div style={{ display: 'flex' }}>
            <Typography noWrap variant="headline" className={classes.schemaName} component="h2">
              {this.props.schema.id}
            </Typography>
            <Switch
              checked={this.props.schema.enabled}
              onChange={this.handleEnable()}
              color="primary"
              classes={{
                switchBase: classes.colorSwitchBase,
                checked: classes.colorChecked,
                bar: classes.colorBar,
              }}
            />
          </div>

        </CardContent>
        <div
          className={classes.media}
          style={{ backgroundColor: '#ccc' }}
        />
        <CardActions classes={{ root: classes.actions }}>
          <div style={styles.endpointAction}>
            {/* <Button size="small" color="primary" >Learn More</Button> */}
            <EndpointSelect endpoints={this.props.endpoints} classes={{root: classes.endpointSelect}}/>
          </div>
          <IconButton size="small" aria-label="Share">
            <CodeIcon />
          </IconButton>
        </CardActions>
      </Card>
    );

  }

}

function mapStateToProps({ config, endpoints }) {
  return { config, endpoints };
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, { setSchema, getEndpoints })
)(Schema);