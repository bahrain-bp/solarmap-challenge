import { PropsWithChildren } from "react";
import {
  Authenticator as AmplifyAuthenticator,
  ThemeProvider as AmplifyThemeProvider,
  Theme,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Box, Typography } from "@mui/material";
import logo from "../assets/logo.png"; // Ensure this path is correct

export const Authenticator: React.FC<PropsWithChildren> = ({ children }) => {
  const theme: Theme = {
    name: "solarmap",
    tokens: {
      colors: {
        font: {
          secondary: { value: "#606060" }, // Grey for texts
        },
        brand: {
          primary: {
            100: { value: "#2A265F" }, // Dark primary color
          },
          secondary: {
            40: { value: "#CCC" }, // Light grey for secondary elements
            100: { value: "#FFFFFF" }, // Light background
          },
        },
      },
      radii: {
        small: { value: "0.75rem" },
      },
      components: {
        authenticator: {
          modal: {
            backgroundColor: { value: "{colors.white}" },
          },
        }
      }
    }
  };

  return (
    <AmplifyThemeProvider theme={theme}>
      <AmplifyAuthenticator
        variation="modal"
        hideSignUp={true}
        components={{
          Header: () => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column", // Stack logo and title vertically
                justifyContent: "center",
                alignItems: "center",
                background: "#073763", // Use brand primary color
                color: "#fff",
                py: "1rem",
                width: "100%",
                borderRadius: "0.5rem 0.5rem 0 0",
              }}
            >
              <img src={logo} alt="Logo" style={{ height: '50px', marginBottom: '10px' }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: 550, fontFamily: "Quicksand" }}
              >
                SolarMap Admin Login
              </Typography>
            </Box>
          ),
          Footer: () => (
            <Box
              sx={{
                background: "#FFF",
                color: "#606060",
                textAlign: "center",
                padding: "1rem",
                fontSize: "0.875rem",
                borderRadius: "0 0 0.5rem 0.5rem",
              }}
            >
              © 2024 SolarMap. All rights reserved.
            </Box>
          ),
        }}
      >
        {children}
      </AmplifyAuthenticator>
    </AmplifyThemeProvider>
  );
};
