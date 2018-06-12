
import green from '@material-ui/core/colors/green';

export default  {
  
  /* Card main
  ------- */
  card: {
    minWidth: 375,
    maxWidth: 375,
    textAlign: 'left'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  schemaName: {
    lineHeight: '48px',
    flexGrow: '1'
  },


  /* Card Actions
  ------- */
  actions: {
    display: 'flex',
  },
  endpointAction: {
    flexGrow: 1
  },
  
  /* Switch
  ------- */
  colorSwitchBase: {
    '&$colorChecked': {
      color: green[500],
      '& + $colorBar': {
        backgroundColor: green[500],
      },
    },
  },
  colorBar: {},
  colorChecked: {},


  
  /* Endpoint Selector
  ------- */
  endpointSelect: {
    maxWidth: '285px',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }
};
