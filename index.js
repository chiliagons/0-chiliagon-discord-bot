const Discord = require('discord.js');
var Airtable = require('airtable');
const client = new Discord.Client({fetchAllMembers:true});
require('dotenv').config();
var list =[];
var usernames = [];

const server = client.guilds.fetch('697821982212751409'); 
const mySecret = process.env.DISCORD_TOKEN;
var base = new Airtable({ apiKey: process.env.AIRTABLE_APIKEY }).base(process.env.AIRTABLE_BASEKEY);
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  getUserNames();
});



//TODO: improve this function to get data on first call
async function getUserNames() {
  base('data').select({
    view: 'Grid view'
  }).firstPage((err, records) => {
    records.forEach(function(record) {
      console.log('Retrieved', record.get('UName'));
      list.push(record.get("UName"));
        });
  });

}

const HelpEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Commands')
	.setAuthor('Mickey', 'https://i.imgur.com/wSTFkRM.png')
	.setDescription('.register [Your name] \n to register yourself ')
	.setTimestamp()
	
  
  function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

client.on('message', async message => {

  
  console.log(usernames)

  if (message.author === client.user || message.author.bot) {
    return;
  }

  if (message.content.startsWith('.register')) {
    getUserNames();
    console.log(list);
    if(list.includes(message.author.username)){
      message.reply('You have already registered!');
    }
    else{
      try {

      base('data').create([
        {
          "fields": {
            "UName": `${message.author.username}`,
            "Name": `${message.content.slice(10)}`
          }
        }
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function(record) {
          console.log(record.getId());
        });
      });
      message.reply('You have registered successfully!');
    }
    catch (err) {
      console.log(err);
    }}
    

  }
  if (message.content == '.help') {
    message.reply(HelpEmbed);
  }
  if( message.content == '.electTA'){
    message.guild.members.cache.forEach(member => {
      if (!member.user.bot && member.user.username !== message.author.username){
      usernames.push(member.user.username);
      }
    });
    let ranppl = getRandom(usernames, 2);
    //Change role ID here to restrict users for this command
    if (message.member.roles.cache.has('868139408698781756'))
    { 
    console.log('User has the required role');
    message.channel.send(`${ranppl[0]} and ${ranppl[1]} elected as teaching assistants!`);
    usernames = [];
  }
  else{
    message.reply(`You dont have permission to access this command!`);
  }
  }
// Optional greeting function

//   client.on('guildMemberAdd', member => {
//     const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
//     if (!channel) return;
//     channel.send(`Welcome to the server, ${member}`);
//   });
}
);

client.login(mySecret);