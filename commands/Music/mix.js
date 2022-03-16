const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
	name: "mix", //the command name for the Slash Command

	category: "Music",
	aliases: ["musicmix", "playmix", "playlist", "playmusicmix"],
	usage: "mix [MIXNAME]",

	description: "Plays a defined Mix", //the command description for Slash Command Overview
	cooldown: 2,
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
			if (channel.userLimit != 0 && channel.full)
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`<:declined:780403017160982538> Your Voice Channel is full, I can't join!`)
					],
				});
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`<:declined:780403017160982538> I am already connected somewhere else`)
					],
				});
			}

			let link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
			if (args[0]) {
				//ncs | no copyrighted music
				if (args[0].toLowerCase().startsWith("n")) link = "https://open.spotify.com/playlist/7sZbq8QGyMnhKPcLJvCUFD";
				//pop
				if (args[0].toLowerCase().startsWith("p")) link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
				//default
				if (args[0].toLowerCase().startsWith("d")) link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
				//remixes from Magic Release
				if (args[0].toLowerCase().startsWith("re")) link = "https://www.youtube.com/watch?v=NX7BqdQ1KeU&list=PLYUn4YaogdahwfEkuu5V14gYtTqODx7R2"
				//rock
				if (args[0].toLowerCase().startsWith("ro")) link = "https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U";
				//rap
				if (args[0].toLowerCase().startsWith("ra")) link = "https://open.spotify.com/playlist/6iwsRWbydLDLPQggncjhKp?si=b6b18faabc66448c";
				//oldgaming
				if (args[0].toLowerCase().startsWith("o")) link = "https://www.youtube.com/watch?v=iFOAJ12lDDU&list=PLYUn4YaogdahPQPTnBGCrytV97h8ABEav"
				//gaming
				if (args[0].toLowerCase().startsWith("g")) link = "https://open.spotify.com/playlist/4bx5c78CAquCWNE4tw1reY?si=145e7cd67b224045";
				//Charts
				if (args[0].toLowerCase().startsWith("cha")) link = "https://www.youtube.com/playlist?list=PLMC9KNkIncKvYin_USF1qoJQnIyMAfRxl"
				//Chill
				if (args[0].toLowerCase().startsWith("chi")) link = "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6";
				//Jazz
				if (args[0].toLowerCase().startsWith("j")) link = "https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt";
				//blues
				if (args[0].toLowerCase().startsWith("b")) link = "https://open.spotify.com/playlist/37i9dQZF1DXd9rSDyQguIk";
				//strange-fruits
				if (args[0].toLowerCase().startsWith("str")) link = "https://open.spotify.com/playlist/6xGLprv9fmlMgeAMpW0x51";
				//study
				if (args[0].toLowerCase().startsWith("stu")) link = "https://open.spotify.com/playlist/4eYYYDgmbtzLuTgdT4t0SG?si=307e315ac6dc45fc";
				//magic-release
				if (args[0].toLowerCase().startsWith("mag")) link = "https://www.youtube.com/watch?v=WvMc5_RbQNc&list=PLYUn4Yaogdagvwe69dczceHTNm0K_ZG3P"
				//mariam
				if (args[0].toLowerCase().startsWith("mar")) link = "https://open.spotify.com/playlist/5dQgwKuBe59Vjs1SfWEO6D?si=0384a027a5824b79"
				//metal
				if (args[0].toLowerCase().startsWith("me")) link = "https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe";
				//heavy metal
				if (args[0].toLowerCase().startsWith("h")) link = "https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe";
				//Arabic Mix
				if (args[0].toLowerCase().startsWith("arab")) link = "https://open.spotify.com/playlist/6wXSqZ3Q0m63Cy0OPr1NB1?si=16ce9cc3933d4b72";
				//Mishoo
				if (args[0].toLowerCase().startsWith("mish")) link = "https://open.spotify.com/playlist/0PLzLZwXWtlgaO81GHn8LL?si=588215b75f43423f";
			}
			let newMsg = await message.reply({
				content: `${client.allEmojis.loading} Loading the **'${args[0] ? args[0] : "Default"}' Music Mix**`,
			});
			try {
				let queue = client.distube.getQueue(guildId)
				let options = {
					member: member,
				}
				if (!queue) options.textChannel = guild.channels.cache.get(channelId)
				await client.distube.playVoiceChannel(channel, link, options)
				//Edit the reply
				newMsg.edit({
					content: `${queue?.songs?.length > 0 ? "👍 Loaded" : "🎶 Now Playing"}: the **'${args[0] ? args[0] : "Default"}'**`,
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

