import isString from "lodash/isString";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
// @mui
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
//
import Image from "../Image";
import BlockContent from "./BlockContent";
import RejectionFiles from "./RejectionFiles";

// ----------------------------------------------------------------------

const DropZoneStyle = styled("div")(({ theme }) => ({
  outline: "none",
  overflow: "hidden",
  position: "relative",
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create("padding"),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  "&:hover": { opacity: 0.72, cursor: "pointer" },
}));

// ----------------------------------------------------------------------

UploadSingleFile.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helperText: PropTypes.node,
  sx: PropTypes.object,
};

export default function UploadSingleFile({
  error = false,
  file,
  helperText,
  name,
  sx,
  maxSize,
  ...other
}) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple: false,
    ...other,
    maxSize,
  });

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: "error.main",
            borderColor: "error.light",
            bgcolor: "error.lighter",
          }),
          ...(file && {
            padding: "12% 0",
          }),
        }}
        name="image"
      >
        <input {...getInputProps()} />

        <BlockContent maxSize={maxSize} />

        {file && (
          <Image
            alt="file preview"
            src={isString(file) ? file : file.preview}
            name={name}
            sx={{
              top: 0,
              left: 0,
              borderRadius: 1,
              position: "absolute",
              // width: "calc(100% - 16px)",
              // height: "calc(100% - 16px)",
            }}
          />
        )}
      </DropZoneStyle>

      {fileRejections.length > 0 && (
        <RejectionFiles fileRejections={fileRejections} />
      )}

      {helperText && helperText}
    </Box>
  );
}
