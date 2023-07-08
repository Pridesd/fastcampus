import { Divider, Grid, List, Paper, Toolbar } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

function Chat() {
  const { channel } = useSelector((state) => state);
  return (
    <>
      <Toolbar />
      <ChatHeader channelInfo={channel.currentChannel} />
      <Grid
        container
        component={Paper}
        variant="outlined"
        sx={{ mt: 3, position: "relative" }}
      >
        <List
          sx={{
            height: "calc(100vh - 350px)",
            overflow: "scroll",
            width: "100%",
            position: "relative",
          }}
        >
          {/* 채팅메시지 */}
          <ChatMessage />
          <ChatMessage />
          <ChatMessage />
          <ChatMessage />
        </List>
        <Divider />
        <ChatInput />
      </Grid>
    </>
  );
}

export default Chat;
