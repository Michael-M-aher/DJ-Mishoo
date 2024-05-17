const { Client, GatewayIntentBits, Intents, Collection } = require('discord.js')
const config = require(`./botconfig/config.json`);
const settings = require(`./botconfig/settings.json`);
const filters = require(`./botconfig/filters.json`);
const colors = require("colors");
const Enmap = require("enmap");
const libsodium = require("libsodium-wrappers");
const voice = require("@discordjs/voice");
const DisTube = require("distube").default;
const envvv = require("dotenv").config();
const { YtDlpPlugin } = require("@distube/yt-dlp");
const client = new Client({
  fetchAllMembers: false,
  //restTimeOffset: 0,
  //restWsBridgetimeout: 100,
  shards: "auto",
  //shardCount: 5,
  allowedMentions: {
    parse: [],
    repliedUser: false,
  },
  failIfNotExists: false,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  presence: {
    activity: {
      name: `-help`,
      type: "Listening",
    },
    status: "online"
  }
});


const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { env } = require('process');
let spotifyoptions = {
  parallel: true,
  emitEventsAfterFetching: true,
}
if (config.spotify_api.enabled) {
  spotifyoptions.api = {
    clientId: process.env.clientId || config.spotify_api.clientId,
    clientSecret: process.env.clientSecret || config.spotify_api.clientSecret,
  }
}
client.distube = new DisTube(client, {
  emitNewSongOnly: false,
  leaveOnEmpty: true,
  leaveOnFinish: false,
  leaveOnStop: true,
  savePreviousSongs: true,
  emitAddSongWhenCreatingQueue: false,
  //emitAddListWhenCreatingQueue: false,
  searchSongs: 0,
  youtubeCookie: process.env.youtubeCookie || config.youtubeCookie,
  nsfw: true, //Set it to false if u want to disable nsfw songs
  emptyCooldown: 25,
  ytdlOptions: {
    highWaterMark: 1024 * 1024 * 64,
    quality: "highestaudio",
    format: "audioonly",
    liveBuffer: 60000,
    dlChunkSize: 1024 * 1024 * 4,
  },
  customFilters: filters,
  plugins: [
    new YtDlpPlugin({ update: true }),
    new SpotifyPlugin(spotifyoptions),
    new SoundCloudPlugin()
  ]
})
//Define some Global Collections
client.commands = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.aliases = new Collection();
client.categories = require("fs").readdirSync(`./commands`);
client.allEmojis = require("./botconfig/emojis.json");
client.maps = new Map();

client.setMaxListeners(100); require('events').defaultMaxListeners = 100;

client.settings = new Enmap({ name: "settings", dataDir: "./databases/settings" });
client.infos = new Enmap({ name: "infos", dataDir: "./databases/infos" });
client.autoresume = new Enmap({ name: "autoresume", dataDir: "./databases/infos" });

//Require the Handlers                  Add the antiCrash file too, if its enabled
["events", "commands", "slashCommands", settings.antiCrash ? "antiCrash" : null, "distubeEvent"]
  .filter(Boolean)
  .forEach(h => {
    require(`./handlers/${h}`)(client);
  })
//Start the Bot
client.login(process.env.tokens || config.token)


/**
 * @LOAD_THE_DASHBOARD - Loading the Dashbaord Module with the BotClient into it!
 */
client.on("ready", () => {
  require("./dashboard/index.js")(client);
})
