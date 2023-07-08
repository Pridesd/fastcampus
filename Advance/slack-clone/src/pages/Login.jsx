import {
  Alert,
  Avatar,
  Box,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import TagIcon from "@mui/icons-material/Tag";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../firebase";
import React, { useCallback, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userReducer";

function Login() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const { user } = await signInWithEmailAndPassword(
          getAuth(),
          email,
          password
        );
        console.log(user);
        dispatch(setUser(user));
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    },
    [dispatch]
  );
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const email = data.get("email");
      const password = data.get("password");
      if (!email || !password) {
        setError("로그인 정보를 입력해주세요");
        return;
      }
      login(email, password);
    },
    [login]
  );

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(""), 2000);
    }
  }, [error]);
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <TagIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          회원가입
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="email"
                required
                fullWidth
                label="이메일 주소"
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                required
                fullWidth
                label="비밀번호"
                type="password"
              />
            </Grid>
          </Grid>
          {error ? (
            <Alert sx={{ mt: 3 }} severity="error">
              {error}
            </Alert>
          ) : null}
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            loading={loading}
            sx={{ mt: 2, mb: 2 }}
          >
            로그인
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                to="/join"
                style={{ textDecoration: "none", color: "blue" }}
              >
                계정이 없나요?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
