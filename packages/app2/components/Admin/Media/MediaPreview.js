import React from "react";
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
import {
  Grid,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  HEADER_MEDIA_PREVIEW,
  MEDIA_EDITOR_ORIGINAL_FILE_NAME_HEADER,
  PREVIEW_PDF_FILE,
  MEDIA_PRIVATE_PREVIEW,
  MEDIA_DIRECT_URL,
  MEDIA_URL_COPIED,
  MEDIA_FILE_TYPE,
} from "../../../config/strings";
import { connect } from "react-redux";
import { mediaProps, addressProps } from "../../../types";
import dynamic from "next/dynamic";
import { Section } from "../../ComponentsLibrary";
import { FileCopy } from "@mui/icons-material";
import { setAppMessage } from "../../../redux/actions";
import AppMessage from "../../../models/app-message";

const PREFIX = 'MediaPreview';

const classes = {
  video: `${PREFIX}-video`,
  img: `${PREFIX}-img`,
  link: `${PREFIX}-link`
};

const StyledSection = styled(Section)({
  [`& .${classes.video}`]: {
    minWidth: 200,
    maxWidth: "100%",
    height: "auto",
  },
  [`& .${classes.img}`]: {
    maxHeight: 200,
  },
  [`& .${classes.link}`]: {
    wordBreak: "break-all",
  },
});

const Img = dynamic(() => import("../../Img.js"));

const MediaPreview = (props) => {
  const { item } = props;
  const { file, originalFileName, mimeType, caption } = item;


  const copyUrl = async (e) => {
    if (!navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(file);
      props.dispatch(setAppMessage(new AppMessage(MEDIA_URL_COPIED)));
    } catch (e) {}
  };

  return (
    <StyledSection>
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Typography variant="h4">{HEADER_MEDIA_PREVIEW}</Typography>
        </Grid>
        <Grid item>
          <Typography>{MEDIA_PRIVATE_PREVIEW}</Typography>
        </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            label={MEDIA_EDITOR_ORIGINAL_FILE_NAME_HEADER}
            fullWidth
            margin="normal"
            name={MEDIA_EDITOR_ORIGINAL_FILE_NAME_HEADER}
            value={originalFileName}
            disabled={true}
          />
        </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            label={MEDIA_FILE_TYPE}
            fullWidth
            margin="normal"
            name={MEDIA_FILE_TYPE}
            value={mimeType}
            disabled={true}
          />
        </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            label={MEDIA_DIRECT_URL}
            fullWidth
            margin="normal"
            name={MEDIA_DIRECT_URL}
            value={file}
            disabled={true}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={copyUrl} size="large">
                    <FileCopy />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          {(mimeType === "image/png" ||
            mimeType === "image/jpeg" ||
            mimeType === "image/webp") && (
            <div className={classes.img}>
              <Img src={file} alt={caption} />
            </div>
          )}
          {mimeType === "video/mp4" && (
            <video controls controlsList="nodownload" className={classes.video}>
              <source src={file} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {mimeType === "audio/mp3" && (
            <audio controls controlsList="nodownload">
              <source src={file} type="audio/mpeg" />
              Your browser does not support the video tag.
            </audio>
          )}
        </Grid>
        {mimeType === "application/pdf" && (
          <Grid item>
            <a href={file} target="_blank" rel="noopener noreferrer">
              {PREVIEW_PDF_FILE}
            </a>
          </Grid>
        )}
      </Grid>
    </StyledSection>
  );
};

MediaPreview.propTypes = {
  item: mediaProps,
  address: addressProps,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  address: state.address,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(MediaPreview);