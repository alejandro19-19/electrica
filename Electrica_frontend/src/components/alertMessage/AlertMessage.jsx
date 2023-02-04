import React, {useState} from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Box } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertMessage = ({ message, type }) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Box>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{horizontal: 'center', vertical: 'top'}}>
        <Alert onClose={handleClose} severity={type} sx={{ width: "300px" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AlertMessage;
