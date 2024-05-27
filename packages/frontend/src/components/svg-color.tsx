import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';

type SvgColorProps = {
  src: string;
  sx?: object;
  [key: string]: any;
};

const SvgColor = forwardRef<HTMLElement, SvgColorProps>(({ src, sx, ...other }, ref) => (
  <Box
    component="span"
    className="svg-color"
    ref={ref}
    sx={{
      width: 24,
      height: 24,
      display: 'inline-block',
      bgcolor: 'currentColor',
      mask: `url(${src}) no-repeat center / contain`,
      WebkitMask: `url(${src}) no-repeat center / contain`,
      ...sx,
    }}
    {...other}
  />
));

SvgColor.propTypes = {
  src: PropTypes.string.isRequired,
  sx: PropTypes.object,
};

export default SvgColor;
