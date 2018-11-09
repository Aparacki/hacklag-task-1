import React, { Component } from "react";
import { Button, createStyles, IconButton, Modal, Theme, WithStyles, withStyles, Typography } from '@material-ui/core';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = (theme: Theme) => createStyles({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

interface Props extends WithStyles<typeof styles> {}


class SimpleModal extends React.Component<Props> {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <Button fullWidth={true} variant="outlined" onClick={this.handleOpen}>
          Tasks
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="h6" id="modal-title">
              Task 1
            </Typography>
            <Typography variant="subtitle1" id="simple-modal-description">
              Build React App in Typescript where you can upload an image and
              rotate it on the screen for desired angle, turn on black and
              white, filter and calculate amount of pixels.
            </Typography>
            <Typography variant="h6" id="modal-title">
              Task 2
            </Typography>
            <Typography variant="subtitle1" id="simple-modal-description">
              Build React App in Typescript where you can upload crime records
              as CSV, build a table from it and present single crime on a map
              (http://samplecsvs.s3.amazonaws.com/SacramentocrimeJanuary2006.csv).
            </Typography>
            
          </div>
        </Modal>
    </>);
  }
}

export default withStyles(styles)(SimpleModal);

