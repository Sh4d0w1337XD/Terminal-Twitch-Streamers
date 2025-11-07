## **Display streamers in Terminal**
<img width="1366" height="768" alt="Screenshot from 2025-11-07 20-41-19" src="https://github.com/user-attachments/assets/d4d6e949-4032-430c-9480-54262d7be09b" />
### Requirements:
  1 - twitch.tv Account
  2 - tmux
  3 - nodejs

Create new app in <a href='dev.twitch.tv'>dev.twitch.tv</a>
This gives you client-id and client-secret(choose public app).
Paste the twitch IDs in js scripts.

Run the `start_tmux.sh` and it should work.

------------------------------------------

#### Modify streamers

Use the search_streamers.js script to find user_id of a twitch streamer.
`node search_steamers.js streamer`
Then add the modidfy streamers dictionary in streamers_live.js


