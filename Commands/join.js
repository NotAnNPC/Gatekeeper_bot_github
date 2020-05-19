module.exports = {
	name: 'join',
	description: 'Adds user to bot role!',
	//cooldown: 5,
	execute(message, args) {
message.channel.send('v16');
const role = message.guild.roles.cache.find(role => role.name === 'Member');
//console.log(role);
if(message.member.roles.cache.find(r => r.name === "Member"))
{ message.channel.send('You\'re already part of the d20monkey team!');
}else{
message.member.roles.add(role);
message.channel.send('You have been added to the '+ role.name + ' role');
}
	},
};
