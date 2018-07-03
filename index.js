require('dotenv').config();
const botConfig = require('./botconfig.json');
const Discord = require('discord.js');
const GphApiClient = require('giphy-js-sdk-core');
const fetch = require('node-fetch');
const list = require('badwords-list');
const badWords = list.array;


const bot = new Discord.Client({disableEveryone: true});

bot.on('ready', async () => {
    console.log(`${bot.user.username} is online!`)
    bot.user.setActivity("Craps at the Ultra-Luxe")
});

bot.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    let prefix = botConfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let sender = message.author;

    //Profanity filter
    messageArray.forEach(m => {
        badWords.forEach(p => {
        if (m.toUpperCase() === p.toUpperCase()) {
            let bicon = bot.user.displayAvatarURL;
            let profanityFilter = new Discord.RichEmbed()
            .setAuthor('OH NO!')
            .setDescription(`Hey, ${sender}! Comments that contain profanity are automatically modified/deleted. Please refrain from explicit or offensive words while in public channels. If you feel this deletion was in error please contact the admin.`)
            .setColor("#f44248")
            .setThumbnail(bicon)
            .setImage('https://i.imgur.com/O1VBW37.png')
            message.delete()
            return message.channel.send(profanityFilter);
        }
    })
})

    //ping pongs hello
    const codsworth = bot.emojis.find("name", "codsworth");
    if (cmd === `${prefix}hello`) return message.channel.send("Hello! Type `!help` for....help" + codsworth);

    //bot info embed
    if (cmd === `${prefix}botinfo`) {
        let bicon = bot.user.displayAvatarURL;
        let infoEmbed = new Discord.RichEmbed()
        .setDescription("Assistant, Advisor, Friend....Except to the Great Kahns")
        .setColor("#42f47a")
        .setThumbnail(bicon)
        .addField("Made With", "Node.js, and ❤️")
        return message.channel.send(infoEmbed);
    }

    //Command list help
    if (cmd === `${prefix}help`) {
        let bicon = bot.user.displayAvatarURL;
        let helpEmbed = new Discord.RichEmbed()
        .setDescription("At your service")
        .setColor("#42f47a")
        .setThumbnail(bicon)
        .addField("Commands:", "`!botinfo`|`!hello`|`!emoji`|`!training`|`!help`|`!gifallout`|    `!guildinfo` ")
        return message.channel.send(helpEmbed);
    }

    //NCR training info
    if (cmd === `${prefix}training`) {
        let bicon = bot.user.displayAvatarURL;
        let trainingEmbed = new Discord.RichEmbed()
        .setTitle("Training Video")
        .setURL('https://www.youtube.com/watch?v=26UDmZRCbm0')
        .setDescription(`Training video and map to up your knowledge/skills with`)
        .addField("Training Map", "https://www.roblox.com/games/1881288112/NCR-enlisting-training")
        .setColor("#42f47a")
        .setThumbnail(bicon)
        .setImage("https://static.giantbomb.com/uploads/original/0/4527/1707586-1.jpg")

        return message.channel.send(trainingEmbed);
    }
    //Lists all custom emojis
    if (cmd === `${prefix}emoji`) {
        const emojiList = message.guild.emojis.map( e => `${e.toString()}, ` ).join(" ");
        let trainingEmbed = new Discord.RichEmbed()
        .setAuthor("Emoji Commands (hover emoji for command)")
        .setDescription(`${emojiList}`)
        .setColor("#42f47a")
        .setThumbnail("https://is1-ssl.mzstatic.com/image/thumb/Purple32/v4/f8/35/72/f83572ef-fb84-41db-16ab-327c09478bb7/mzm.wqmrzyve.png/246x0w.jpg")
        .setImage("https://i.imgur.com/8o7oQm0.png")

        return message.channel.send(trainingEmbed);
    }
    //Request random fallout gif.
    if (cmd === `${prefix}gifallout`) {
        const gif = await GphApiClient(process.env.GIF_API)
        gif.translate('gifs', {"s": 'Fallout Game'})
        .then(res => {
            let gifallout = res.data.images.downsized.gif_url
            let bicon = bot.user.displayAvatarURL;
            let gifEmbed = new Discord.RichEmbed()
            .setAuthor("Yes Man Gif Generator")
            .setDescription(`Here Ya Go!`)
            .setColor("#42f47a")
            .setThumbnail(bicon)
            .setImage(`${gifallout}`)

        return message.channel.send(gifEmbed);
        }).catch(err => console.error(err));
    }

    if (cmd === `${prefix}guildinfo`) {
        (async function () {
            const res = await fetch("https://api.roblox.com/groups/576620");
            const Guild = await res.json();
            const Roles = Guild.Roles.map(r => `Name: ${r.Name} , Rank: ${r.Rank} ---   `)
            let bicon = bot.user.displayAvatarURL;
            let gifEmbed = new Discord.RichEmbed()
            .setTitle(`${Guild.Name}`)
            .setURL('https://www.roblox.com/My/Groups.aspx?gid=576620')
            .setDescription(`${Guild.Description}`)
            .setColor("#42f47a")
            .setThumbnail(bicon)
            .setFooter(`Guild Owner: ${Guild.Owner.Name}`)
            .addField("Roles =============================", `${Roles}`)
            .setImage(`https://i.imgur.com/NPZImHz.jpg`)

        return message.channel.send(gifEmbed);
        })().catch(err => console.error(err));
    }


});

    //Greets new members with message and basic comands.
    bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'general');
    if (!channel) return;
    // Send the message, mentioning the member
    let bicon = bot.user.displayAvatarURL;
    let welcomeEmbed = new Discord.RichEmbed()
        .setAuthor("Hey! Hi there, good to meet you!")
        .setDescription(`Welcome to the NCR, ${member}`)
        .setColor("#42f47a")
        .setThumbnail(bicon)
        .setImage("https://i.imgur.com/Qo4hAPV.png")
        .addField("Info", "Type `!help` for list of commands")

    channel.send(welcomeEmbed);
    console.log("greeting sent")
  });
bot.login(process.env.TOKEN)