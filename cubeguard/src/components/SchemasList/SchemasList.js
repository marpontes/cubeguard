import React, { Component } from 'react';
import styles from './SchemasList.styles'
import Schema from '../Schema/Schema';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { getSchemas } from '../../actions/schema';

class SchemasList extends Component{

    componentDidMount(){
        this.props.getSchemas();
    }

    getEnabled( schema ){
        const DSP_CLASS = this.props.config["cubeguard.dspClass"];
        return schema.data !== undefined
                && schema.data["DynamicSchemaProcessor"] !== undefined
                && schema.data["DynamicSchemaProcessor"] === DSP_CLASS;
      }

    childUpdateHandler(newSchema){
        for(let schema in this.props.schemas){
            if (schema.id === newSchema.id){
                schema = Object.assign({}, newSchema);
                schema.updated = this.getEnabled(schema)
            }
        }
    }

    getSchemasList(){
        return this.props.schemas.map( (s, idx) => {
            s.enabled = this.getEnabled(s);
            return (
                <Grid item key={idx}>
                   <Schema 
                    schema={s} 
                    updateHandler={this.childUpdateHandler.bind(this)}
                    />
                </Grid>
            );
        });
    }

    render() {
        const { classes } = this.props;
        return  (
            <div>
                <Grid 
                    spacing={32} 
                    className={classes.root}  
                    container>
                        {this.getSchemasList()}
                </Grid>
            </div>
        );
    }
}



function mapStateToProps({schema, config}) {
    return {
      schemas : schema.schemas,
      config : config
    };
  }

  export default compose(
    withStyles(theme => (styles)),
    connect(mapStateToProps, { getSchemas })
  )(SchemasList);