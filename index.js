//Stuff that makes the things work
const fs = require('fs');
const Discord = require('discord.js');
//Reference config.json for values
const { prefix, token } = require('./config.json');
const cooldowns = new Discord.Collection();
const client = new Discord.Client();
client.commands = new Discord.Collection();
//retrieve all the command files from the Commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//take name of
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}



client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
  //if the message doesn't have the prifix or was sent by a bot, exit early
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  //slice prefix and split into array
  const args = message.content.slice(prefix.length).split(/ +/);
  //Create command variabe for first element in array
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if (command.args && !args.length) {
    return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }

});

client.login(token);
