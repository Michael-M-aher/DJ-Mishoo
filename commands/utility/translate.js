const { Client, Message, MessageEmbed } = require("discord.js");
const translate = require("@iamtraction/google-translate");
const config = require(`../../botconfig/config.json`);

module.exports = {
  name: "translate",
  aliases: ["ts"],
  category: "utility",
  description: "google translate",
  usage: "translate <From> <To> <Text to be translated>",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const query = args.slice(2).join(" ");
      if (!query)
        return message.reply(
          `Dont leave this blank! Try this: \`${config.prefix}translate id Hello! I'm Altmr!\``
        );
	var arg1 = args[0];
      var arg2 = args[1];
	if(arg1 == "ch"){
		arg1 = "zh-CN"
	};
	if(arg2 == "ch"){
		arg2 = "zh-CN"
	};
      const translated = await translate(query, { from: `${arg1}`, to: `${arg2}` });
      const embed = new MessageEmbed()
        .setTitle("Translated!")
        .addField("Your Query", `\`\`\`fix\n${query}\`\`\``)
        .addField("Result", `\`\`\`fix\n${translated.text}\`\`\``)
        .setFooter(`© ${client.user.username}`)
        .setColor("#d4c5a2");
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      return message.channel
        .send(
          `Your question is invalid! Try this: \`${config.prefix}translate <From> <To> <query>\``
        )
        .then(() => console.log(error));
    }
  },
};
