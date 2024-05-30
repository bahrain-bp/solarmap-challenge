import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';

type IconifyProps = {
  icon: string;
  width?: number;
  sx?: object;
  [key: string]: any;
};

const Iconify = forwardRef<HTMLElement, IconifyProps>(({ icon, width = 20, sx, ...other }, ref) => (
  <Box
    ref={ref}
    component={Icon}
    className="component-iconify"
    icon={icon}
    sx={{ width, height: width, ...sx }}
    {...other}
  />
));

Iconify.propTypes = {
  icon: PropTypes.string.isRequired,
  sx: PropTypes.object,
  width: PropTypes.number,
};

export default Iconify;
