import React, {useState} from 'react';
import { connect } from 'react-redux';
import { Dialog } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';

const CreateMintDialog = (props) => {
  const { show, closeProfileDlg, profileUpdateStatus } = props;

  return (
    <Dialog
      className="buy-collectible-dialog"
      open={show}
      onClose={closeProfileDlg}
      maxWidth={'xs'}
    >
      <FontAwesomeIcon icon={faTimes} className="close-icon" onClick={closeProfileDlg} />

      <div className="dialog-body">
        <h2 className="dialog-title">Profile Update</h2>
        {
          profileUpdateStatus?<p className="dialog-description">Profile has been updated successfully!</p> :
          <p className="dialog-description">An error occurred while updating the profile.</p>
        }
        
        
        <button className="confirm-btn" onClick={closeProfileDlg}>
          Ok
        </button>
      </div>
    </Dialog>
  );
};


export default CreateMintDialog;
