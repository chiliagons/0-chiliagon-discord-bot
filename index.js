const Discord = require('discord.js');
var Airtable = require('airtable');
const client = new Discord.Client({fetchAllMembers:true});

require('dotenv').config();
var list =[];
var usernames = [];

const mySecret = process.env.DISCORD_TOKEN;
var base = new Airtable({ apiKey: process.env.AIRTABLE_APIKEY }).base(process.env.AIRTABLE_BASEKEY);
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await getUserNames();
  client.user.setActivity('.help', { type: 'PLAYING' })
});

//TODO: improve this function to get data on first call
async function getUserNames() {
  base('Student Register').select({
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
	.setDescription(' ```.register [Your name] ``` \n - To register yourself \n ```.randomVolunteers ``` \n - Choose random volunteers (can only be accessed by users with admin role) \n ```.show course plan ``` \n -List course plan')
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

// Greeting function (testing left)
client.on('guildMemberAdd', member => {
  if(!member.user.bot){
  member.guild.channels.get(process.env.CHANNEL_ID).send(`Welcome to the server, ${member}`);
  }
});

client.on('message', async message => {
  
  if (message.author === client.user || message.author.bot) {
    return;
  }

  if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

  if (message.mentions.has(client.user.id)) {
        message.reply(`Hello there! ${message.author}`);
    };

  if (message.content == 'bleep'){
    message.reply(`Bloop🤖`);
  }
  if (message.content.startsWith('.register')) {
    await getUserNames();
    console.log(list);
    if(list.includes(message.author.username)){
      message.reply('You have already registered!');
    }
    else{
      try {

      base('Student Register').create([
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
      message.reply('You have registered successfully!✨');
    }
    catch (err) {
      console.log(err);
    }}
    

  }
  if (message.content == '.help') {
    message.reply(HelpEmbed);
  }
  if( message.content == '.randomVolunteers'){
    let channelID = message.channel.id;
    message.guild.channels.cache.get(channelID).members.forEach((member) => {
    // message.guild.members.cache.forEach(member => {
      if (!member.user.bot && member.user.username !== message.author.username){
      usernames.push(member);
      }
    });
    let ranppl = getRandom(usernames, 3);
    //Change role ID here to restrict users for this command
    if (message.member.roles.cache.has(process.env.ROLE_ID))
    { 
    console.log('User has the required role');
    message.channel.send(`${ranppl[0]} , ${ranppl[1]} and ${ranppl[2]} chosen as volunteers! 🚀`);
    usernames = [];
  }
  else{
    message.reply(`You dont have permission to access this command!`);
  }
  }
  if (message.content === ".show course plan") {
    try {
      base('Solidity Course Plan').select({
        view: 'Grid view',
        filterByFormula: `{Status} = "Todo"`
      }).firstPage(function(err, records) {
          message.channel.send(`\n \n \n > **${records[0].get('Module')}** \n\n ${records[0].get('Notes')}\n ***Required Readings:*** \n \n 
          ${records[0].get('Required Reading')} \n ***Start Date :*** ${records[0].get('Start Date')} \n \n ***Meeting Link: *** \n ${records[0].get('Meeting link')} \n `)
        });
    }
    catch (err) {
      console.log(err);
    }
  }
}
);

client.login(mySecret);
