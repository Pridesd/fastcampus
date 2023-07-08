import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import "../firebase";
import { getAuth, signOut } from "firebase/auth";

function Header() {
  const { user } = useSelector((state) => state);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenMenu = useCallback((e) => {
    setAnchorEl(e.currentTarget);
  }, []);
  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const logOut = useCallback(async () => {
    await signOut(getAuth());
    setAnchorEl(null);
  }, []);
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: "#9A939B",
        backgroundColor: "#4c3c4C",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "50px",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <TagIcon />
          <Typography variant="h6" component="div">
            SLACK
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={handleOpenMenu}>
            <Typography variant="h6" component="div" sx={{ color: "#94939B" }}>
              {user.currentUser?.displayName}
            </Typography>
            <Avatar
              sx={{ marginLeft: "10px" }}
              alt="profile"
              src={user.currentUser?.photoURL}
            />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem>
              <Typography textAlign="center">프로필 이미지</Typography>
            </MenuItem>
            <MenuItem>
              <Typography textAlign="center" onClick={logOut}>
                로그아웃
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
