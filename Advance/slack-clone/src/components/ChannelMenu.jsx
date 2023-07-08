import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import React, { useCallback, useEffect, useState } from "react";
import "../firebase";
import {
  child,
  getDatabase,
  onChildAdded,
  push,
  ref,
  update,
} from "firebase/database";
import { useDispatch } from "react-redux";
import { setCurrentChannel } from "../store/channelReducer";

function ChannelMenu() {
  const [open, setOpen] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelDetail, setChannelDetail] = useState("");
  const [channels, setChannels] = useState([]);
  const [firstLoaded, setFirstLoaded] = useState(true);
  const [activeChannelId, setActiveChannelId] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = useCallback(async () => {
    const db = getDatabase();
    const key = push(child(ref(db), "channels")).key; //채널스 하위에 키를 생성함
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetail,
    };
    const updates = {};
    updates["/channels/" + key] = newChannel;

    try {
      await update(ref(db), updates);
      setChannelName("");
      setChannelDetail("");
      handleClickClose();
    } catch (e) {
      console.error(e);
    }
  }, [channelDetail, channelName]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickClose = () => {
    setOpen(false);
  };

  const changeChannel = (c) => {
    if (c.id === activeChannelId) return;
    setActiveChannelId(c.id);
    dispatch(setCurrentChannel(c));
  };

  useEffect(() => {
    const db = getDatabase();
    const unsubscribe = onChildAdded(ref(db, "channels"), (snapshot) => {
      setChannels((channelArr) => [...channelArr, snapshot.val()]);
    });
    return () => {
      setChannels([]);
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (channels.length > 0 && firstLoaded) {
      setActiveChannelId(channels[0].id);
      dispatch(setCurrentChannel(channels[0]));
      setFirstLoaded(false);
    }
  }, [channels, firstLoaded, dispatch]);

  return (
    <>
      <List sx={{ overflow: "auto", width: 240, backgroundColor: "#4c3c4c" }}>
        <ListItem
          secondaryAction={
            <IconButton sx={{ color: "#9A939B" }} onClick={handleClickOpen}>
              <AddIcon />
            </IconButton>
          }
        >
          <ListItemIcon sx={{ color: "#9A939B" }}>
            <ArrowDropDownIcon />
          </ListItemIcon>
          <ListItemText
            primary="채널"
            sx={{ wordBreak: "break-all", color: "9A939B" }}
          />
        </ListItem>
        <List component="div" disablePadding sx={{ pl: 3 }}>
          {
            //스토어 구현 해야함 selected 구현
            channels.map((channel) => (
              <ListItem
                button
                selected={channel.id === activeChannelId}
                onClick={() => changeChannel(channel)}
                key={channel.id}
              >
                <ListItemText
                  primary={`# ${channel.name}`}
                  sx={{ wordBreak: "break-all", color: "#918890" }}
                />
              </ListItem>
            ))
          }
        </List>
      </List>
      <Dialog open={open} onClose={handleClickClose}>
        <DialogTitle>채널 추가</DialogTitle>
        <DialogContent>
          <DialogContentText>
            생성할 채널명과 설명을 입력해주세요.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="채널명"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setChannelName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="채널설명"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setChannelDetail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>취소</Button>
          <Button onClick={handleSubmit}>생성</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ChannelMenu;
