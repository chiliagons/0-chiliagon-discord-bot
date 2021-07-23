const Discord = require('discord.js');
var Airtable = require('airtable');
const client = new Discord.Client();
require('dotenv').config();
var ran1, ran2;
var list =[];

const server = client.guilds.fetch(process.env.GUILD_ID); 
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
	
client.on('message', async message => {

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
  function roll(){
    var ran0 =message.guild.members.cache.filter(member => member.roles.cache.has('868139408698781756'))
  .map(member => member.user.username)  
     ran1 = message.guild.members.cache.random().user;
     ran2 = message.guild.members.cache.random().user;
     
     console.log(ran0)
     if(ran1 === ran2 || ran1.username == 'mickey bot' ){
         roll()
     }
    }
     
//TODO: Add role based action and fix the issue where only the bot and author is being read as members by the bot
  if( message.content == '.electTA'){
   
   roll();
   message.channel.send(`${ran1} and ${ran2}`);

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