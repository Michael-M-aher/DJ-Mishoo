const {
	MessageEmbed,
	MessageSelectMenu,
	MessageActionRow,
	Message
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const apiKey = process.env.geniusapi || config.geniusapi;
const Genius = require("genius-lyrics");
const Client = new Genius.Client(apiKey);
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
	lyricsEmbed,
	check_if_dj
} = require("../../handlers/functions");
module.exports = {
	name: "lyrics", //the command name for the Slash Command
	category: "Song",
	usage: "lyrics",
	aliases: ["ly", "songtext"],
	description: "Sends the Song Lyrics", //the command description for Slash Command Overview
	cooldown: 20,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, message, args) => {
		try {
			//things u can directly access in an interaction!
			const {
				member,
				channelId,
				guildId,
				applicationId,
				commandName,
				deferred,
				replied,
				ephemeral,
				options,
				id,
				createdTimestamp
			} = message;
			const {
				guild
			} = member;
			const {
				channel
			} = member.voice;
			if (!channel) return message.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
				],

			})
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter({ text: ee.footertext, iconURL: ee.footericon })
						.setTitle(`${client.allEmojis.x} Join __my__ Voice Channel!`)
						.setDescription(`<#${guild.me.voice.channel.id}>`)
					],
				});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **I am nothing Playing right now!**`)
					],

				})
				let embeds = [];
				let pages = []
				songname = newQueue.songs[0].name
				if (songname.includes(' - ') && songname.includes(' (')) {
					song = songname.split(' - ')
					songname = song[1].split(' (')[0] + ' ' + song[0]
				}
				const searches = await Client.songs.search(songname);
				if (!searches[0]) return message.reply({
					content: `${client.allEmojis.x} **No Lyrics Found!** :cry:`,
				});
				await searches[0].lyrics().then(
					async lyrics => {
						embeds = lyricsEmbed(lyrics, newQueue.songs[0]);
					}).catch(e => {
						console.log(e)
						return message.reply({
							content: `${client.allEmojis.x} **No Lyrics Found!** :cry:\n${String(e).substr(0, 1800)}`,
						});
					})
				for (let i = 0; i < embeds.length; i++) {
					pages.push(embeds.slice(i, i + 1));
				}
				const Menu = new MessageSelectMenu()
					.setCustomId(songname)
					.setPlaceholder("Select a Page")
					.addOptions([
						pages.map((page, index) => {
							let Obj = {};
							Obj.label = `Page ${index + 1}`
							Obj.value = `${index}`;
							Obj.description = `Shows the ${index + 1}/${pages.length} Page!`
							return Obj;
						})
					])
				const row = new MessageActionRow().addComponents([Menu])
				await message.reply({
					embeds: [embeds[0]],
					fetchReply: true,
					components: [row],
					ephemeral: true
				}).then(msg => {
					const sampleFilter = menu => menu.customId === songname;
					const sampleFilterCollector = msg.createMessageComponentCollector({ filter: sampleFilter, time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000 }); //10 seconds to use the button

					sampleFilterCollector.on('collect', async i => {
						await i.update({
							embeds: pages[Number(i.values[0])], fetchReply: true,
							components: [row],
							ephemeral: true
						})
					})
				});
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				message.reply({
					content: `${client.allEmojis.x} | Error: `,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
							.setDescription(`\`\`\`${e}\`\`\``)
					],

				})
			}
		} catch (e) {
			console.log(String(e.stack).bgRed)
		}
	}
}
