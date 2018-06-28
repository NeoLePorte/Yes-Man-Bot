const botConfig = require('./botconfig.json');
const Discord = require('discord.js');
const tokenFile = require('./tokenFile.json')
const GphApiClient = require('giphy-js-sdk-core');
const fetch = require('node-fetch');


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

    //ping pongs hello
    if (cmd === `${prefix}hello`) return message.channel.send("Hello! Type `!help` for....help🤖");

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
        .setAuthor("Follow the link for more information")
        .setDescription(`https://www.youtube.com/watch?v=26UDmZRCbm0`)
        .addField("Training Map", "https://www.roblox.com/games/2007834554/new-NCR-training-camp")
        .setColor("#42f47a")
        .setThumbnail(bicon)
        .setImage("https://static.giantbomb.com/uploads/original/0/4527/1707586-1.jpg")
        .addField("Info", "Short video to prepare you for the wasteland")

        return message.channel.send(trainingEmbed);
    }
    //Lists all custom emojis
    if (cmd === `${prefix}emoji`) {
        const emojiList = message.guild.emojis.map( e => `${e.toString()}, ` ).join(" ");
        console.log(emojiList)
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
        const gif = GphApiClient(tokenFile.GIF_API)
        gif.translate('gifs', {"s": 'Fallout Game'})
        .then(res => {
            let gifallout = res.data.images.downsized.gif_url
            let bicon = bot.user.displayAvatarURL;
            let gifEmbed = new Discord.RichEmbed()
            .setAuthor("Yes Man Gif Generator")
            .setDescription(`GIFALLOUT`)
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
            const Roles = Guild.Roles.map(r => `Name: ${r.Name}, Rank: ${r.Rank} ---`)
            console.log(Guild);
            let bicon = bot.user.displayAvatarURL;
            let gifEmbed = new Discord.RichEmbed()
            .setAuthor(`${Guild.Name}`)
            .setDescription(`${Guild.Description}`)
            .setColor("#42f47a")
            .setThumbnail(bicon)
            .setFooter(`Guild Owner: ${Guild.Owner.Name}`)
            .addField("Roles", `${Roles}`)
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


bot.login(tokenFile.token)