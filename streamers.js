const fs = require('fs');
const { exec } = require('child_process');
// VARS
const tokens_file = '' // PATH to your tokens.json FILE
const client_id = ""; // yours twitch's app CLIENT ID
const client_secret = ""; // yours twitch's app CLIENT SECRET

let tokens = readTokens();

const refresh_time = 5000; // 5s
// STREAMER VARS  |  CHANGE TO YOUR PREFERENCE 
const ratirl_id = "57292293";
const forsen_id = "22484632";

const streamers = {
	"RATIRL"	: ratirl_id,
	"forsen"	: forsen_id, 
};

// URL SETUP 
const api_url = "https://api.twitch.tv/helix/streams?user_id=";
let uri_parms = "";
let first_iritation = true;

for (let key in streamers){
    if (first_iritation){
		uri_parms = `${streamers[key]}`;
		first_iritation = false;
	}
	else uri_parms += `&user_id=${streamers[key]}`;
}
const url = api_url + uri_parms;

// FUNCTIONS 
function readTokens() {
    if (!fs.existsSync(tokens_file)) {
        return { access_token: null, refresh_token: null };
    }
    const data = fs.readFileSync(tokens_file, 'utf8');
    return JSON.parse(data);
}

function saveTokens(access_token, refresh_token) {
    fs.writeFileSync(tokens_file, JSON.stringify({ access_token, refresh_token }, null, 2));
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function refreshTokens() {
    const response = await fetch("https://id.twitch.tv/oauth2/token", {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            'client_id': client_id,
            'client_secret': client_secret,
            'refresh_token': tokens.refresh_token,
            'grant_type': 'refresh_token',
        })
    });
    const data = await response.json();
    saveTokens(data.access_token, data.refresh_token);
    tokens.access_token = data.access_token;
    tokens.refresh_token = data.refresh_token;
}

async function main() {
	//process.stdout.write('\x1B[?25l'); // hide cursor
	while (true){
		const terminalWidth = process.stdout.columns || 80;

		fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${tokens.access_token}`,
				'Client-Id': `${client_id}`
			}
		})
		.then(r => {
			return r.json();
		})
		.then(data => {
			if (data.status == 401)
				refreshTokens();
			else {
				console.clear();
				console.log("\n");

				for (let streamer in streamers){
					const streamer_live = data.data.find(item => item.user_id === streamers[streamer])
					if (streamer_live) {
						const start_time = new Date(streamer_live.started_at);
						const current_time = new Date();
						const up_time_utc = current_time - start_time;

						const totalSeconds = Math.floor(up_time_utc / 1000);
						const hours = Math.floor(totalSeconds / 3600);
						const minutes = Math.floor((totalSeconds % 3600) / 60);
						const seconds = totalSeconds % 60;

						const up_time = `${hours.toString().padStart(2,'0')}:` +
										`${minutes.toString().padStart(2, '0')}:` +
										`${seconds.toString().padStart(2, '0')}`;
						
						text = `🔴 ${streamer_live.user_name}: {${streamer_live.game_name}, ${up_time}}`;
						padl = Math.floor((terminalWidth - text.length) / 2);
						console.log(" ".repeat(padl) + text);
					}
					else {
						text = `🪦 ${streamer}`;
						padl = Math.floor((terminalWidth - text.length) / 2);
						console.log(" ".repeat(padl) + text);
					}
				}
			}
		})
		.catch(e => {
		    console.log("ERROR:\n" + e);
			if (e.name === 'RangeError'){
				exec('tmux resize-pane -L 1', (error, stderr) => {
					if(error)console.log(error)
					if(stderr) console.log(stderr)
				})
			}
		});

		await sleep(refresh_time);
	}
}

main();
