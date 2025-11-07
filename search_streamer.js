const fs = require('fs');
// VARS
const tokens_file = '' // PATH to your tokens.json FILE
const client_id = ""; // yours twitch's app CLIENT ID
const client_secret = ""; // yours twitch's app CLIENT SECRET

let tokens = readTokens();

// CHECK ARGS
const args = process.argv.slice(2);
if(args.length > 1 || args.length == 0){
	console.log("   Wrong arguments\n - Usage: node search_channel.js channel_name");
}
const channel = args[0];

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

async function main(channel) {
	const r = await fetch(`https://api.twitch.tv/helix/search/channels?query=${channel}`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${tokens.access_token}`,
			'Client-Id': `${client_id}`
		}
	});
	
	const data = await r.json();

	if (data.status == 401){
		refreshTokens();
		return search_channel(channel);
	}
	else
		output(data, channel);
}

function output(data, channel){
	for(let streamer of data.data){
			if(streamer.display_name === channel){
				console.log(streamer);
			}
		}
}

main(channel);