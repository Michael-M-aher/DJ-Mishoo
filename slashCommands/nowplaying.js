const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../botconfig/config.json");
const ee = require("../botconfig/embed.json");
const settings = require("../botconfig/settings.json");
const {
	check_if_dj
} = require("../handlers/functions")
module.exports = {
	name: "nowplaying", //the command name for the Slash Command
	description: "Shows the current Playing Song", //the command description for Slash Command Overview
	cooldown: 2,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, interaction) => {
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
			} = interaction;
			const {
				guild
			} = member;
			const {
				channel
			} = member.voice;
			if (!channel) return interaction.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
				],
				ephemeral: true
			})
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return interaction.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter({ text: ee.footertext, iconURL: ee.footericon })
						.setTitle(`${client.allEmojis.x} Join __my__ Voice Channel!`)
						.setDescription(`<#${guild.me.voice.channel.id}>`)
					],
					ephemeral: true
				});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return interaction.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **I am nothing Playing right now!**`)
					],
					ephemeral: true
				})
				let newTrack = newQueue.songs[0];
				interaction.reply({
					content: `${client.settings.get(guild.id, "prefix")}play ${newTrack.url}`,
					embeds: [
						new MessageEmbed().setColor(ee.color)
							.setTitle(newTrack.name)
							.setURL(newTrack.url)
							.addFields({ name: `💡 Requested by:`, value: `>>> ${newTrack.user}`, inline: true })
							.addFields({ name: `⏱ Duration:`, value: `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, inline: true })
							.addFields({ name: `🌀 Queue:`, value: `>>> \`${newQueue.songs.length} song(s)\`\n\`${newQueue.formattedDuration}\``, inline: true })
							.addFields({ name: `🔊 Volume:`, value: `>>> \`${newQueue.volume} %\``, inline: true })
							.addFields({ name: `♾ Loop:`, value: `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `${client.allEmojis.check_mark}\` Queue\`` : `${client.allEmojis.check_mark} \`Song\`` : `${client.allEmojis.x}`}`, inline: true })
							.addFields({ name: `↪️ Autoplay:`, value: `>>> ${newQueue.autoplay ? `${client.allEmojis.check_mark}` : `${client.allEmojis.x}`}`, inline: true })
							.addFields({ name: `❔ Download Song:`, value: `>>> [\`Click here\`](${newTrack.streamURL})`, inline: true })
							.addFields({ name: `❔ Filter${newQueue.filters.length > 0 ? `s` : ``}:`, value: `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f => `\`${f}\``).join(`, `)}` : `${client.allEmojis.x}`}`, inline: newQueue.filters.length > 1 ? false : true })
							.addFields({ name: `<:Youtube:840260133686870036>  View${newTrack.views > 0 ? "s" : ""}:`, value: `>>> \`${newTrack.views}\``, inline: true })
							.addFields({ name: `:thumbsup: Like${newTrack.likes > 0 ? "s" : ""}:`, value: `>>> \`${newTrack.likes}\``, inline: true })
							.addFields({ name: `:thumbsdown: Dislike${newTrack.dislikes > 0 ? "s" : ""}:`, value: `>>> \`${newTrack.dislikes}\``, inline: true })
							.setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
							.setFooter({
								text: `Played in: ${guild.name}`, iconURL: guild.iconURL({
									dynamic: true
								})
							}).setTimestamp()
					]
				}).catch((e) => {
					onsole.log(e.stack ? e.stack : e)
				})
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				interaction.editReply({
					content: `${client.allEmojis.x} | Error: `,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
							.setDescription(`\`\`\`${e}\`\`\``)
					],
					ephemeral: true
				})
			}
		} catch (e) {
			console.log(String(e.stack).bgRed)
		}
	}
}

