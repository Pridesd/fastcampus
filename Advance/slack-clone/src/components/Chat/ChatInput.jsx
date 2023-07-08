import { Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import "../../firebase";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDatabase,
  push,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";

function ChatInput() {
  const { channel, user } = useSelector((state) => state);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = useCallback((e) => setMessage(e.target.value), []);

  const createMessage = useCallback(
    () => ({
      timestamp: serverTimestamp(),
      user: {
        id: user.currentUser.uid,
        name: user.currentUser.displayName,
        avatar: user.currentUser.photoURL,
      },
      content: message,
    }),
    [
      message,
      user.currentUser?.displayName,
      user.currentUser?.photoURL,
      user.currentUser?.uid,
    ]
  );
  const sendMessage = useCallback(async () => {
    if (!message) return;
    setLoading(true);
    try {
      await set(
        push(ref(getDatabase(), "messages/" + channel.currentChannel?.id)),
        createMessage()
      );
      setLoading(false);
      setMessage("");
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, [message, createMessage, channel.currentChannel?.id]);
  return (
    <Grid container sx={{ p: "20px" }}>
      <Grid item xs={12} sx={{ position: "relative" }}>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <InsertEmoticonIcon />
                </IconButton>
                <IconButton>
                  <ImageIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="start">
                <IconButton disabled={loading} onClick={sendMessage}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="off"
          label="메시지 입력"
          fullWidth
          value={message}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
}

export default ChatInput;
