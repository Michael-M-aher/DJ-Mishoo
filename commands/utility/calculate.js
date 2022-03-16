const { Client, Message, MessageEmbed } = require("discord.js");
const math = require("mathjs");

module.exports = {
  name: "calculate",
  aliases: ["cal", "math"],
  category: "utility",
  description: "Get the answer to a math problem",
  usage: "cal <question>",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!args[0]) return message.channel.send("Please provide a question");

    let resp;

    try {
      resp = math.evaluate(args.join(" "));
    } catch (e) {
      return message.channel.send("Please provide a **valid** question");
    }

    message.channel
      .send({ embeds: [ 
        new MessageEmbed()
          .setColor("RED")
          .setDescription(`Getting Answer of ${args}`)
          .setFooter(`\`Coded by: Mishoo Maher\``)] }
      )
      .then((msg) => {
        msg.edit({ embeds: [ 
          new MessageEmbed()
            .setColor("RED")
            .setTitle("Calculator")
            .addField("Question", `\`\`\`css\n${args.join(" ")}\`\`\``)
            .addField("Answer", `\`\`\`css\n${resp}\`\`\``)
            .setFooter(`\`Coded by: Mishoo Maher\``)] }
        );
      });
  },
};
