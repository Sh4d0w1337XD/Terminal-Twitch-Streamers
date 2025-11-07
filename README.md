## **Display streamers in Terminal**
<img width="1366" height="768" alt="Screenshot from 2025-11-07 20-41-19" src="https://github.com/user-attachments/assets/d4d6e949-4032-430c-9480-54262d7be09b" />

### Requirements

1. [twitch.tv](https://twitch.tv) Account
2. tmux
3. nodejs


Create new app in [dev.twitch.tv](https://dev.twitch.tv) (choose **private** type of client)<br>
This gives you client-id and client-secret<br>
Update client_id and client_secret in both js scripts<br>
Modify PATH in start_tmux.sh and both js scripts so it can locate tokens.json file

Run the `start_tmux.sh` and it should work.

------------------------------------------

#### Modify streamers

Use the search_streamers.js script to find user_id of a twitch streamer

`node search_steamers.js streamer`

Then modify streamers dictionary in streamers.js script


