
  const { Client, Collection,AuditLogEvent, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const blacklistDB = new Database("/Json-db/Bots/blacklistDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")

let blacklist = tokens.get('blacklist')
if(!blacklist) return;
const path = require('path');
const { readdirSync } = require("fs");
let theowner;
blacklist.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client8 = new Client({intents: 32767, shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client8.commands = new Collection();
  require(`./handlers/events`)(client8);
  client8.events = new Collection();
  require(`../../events/requireBots/blacklist-commands`)(client8);
  const rest = new REST({ version: '10' }).setToken(token);
  client8.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client8.user.id),
          { body: blacklistSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
    require(`./handlers/events`)(client8)
  const folderPath = path.join(__dirname, 'slashcommand8');
  client8.blacklistSlashCommands = new Collection();
  const blacklistSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("blacklist commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          blacklistSlashCommands.push(command.data.toJSON());
          client8.blacklistSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'commands8');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/blacklist-commands`)(client8)
require("./handlers/events")(client8)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client8.once(event.name, (...args) => event.execute(...args));
	} else {
		client8.on(event.name, (...args) => event.execute(...args));
	}
	}

client8.on('ready' , async() => {
  setInterval(async() => {
    let BroadcastTokenss = tokens.get(`blacklist`)
    let thiss = BroadcastTokenss.find(br => br.token == token)
    if(thiss) {
      if(thiss.timeleft <= 0) {
        await client8.destroy();
        console.log(`${clientId} Ended`)
      }
    }
  }, 1000);
})


  client8.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client8.blacklistSlashCommands.get(interaction.commandName);
	    
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      if (command.ownersOnly === true) {
        if (owner != interaction.user.id) {
          return interaction.reply({content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true});
        }
      }
      try {

        await command.execute(interaction);
      } catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
    }
  } )

  client8.on("messageCreate" , async(message) => {
    let client = message.client;
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;


  if(!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g); 
  const cmd = args.shift().toLowerCase();
  if(cmd.length == 0 ) return;
  let command = client.commands.get(cmd)
  if(!command) command = client8.commands.get(client.commandaliases.get(cmd));

  if(command) {
    if(command.ownersOnly) {
			if (owner != message.author.id) {
			  return message.reply({content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true});
			}
    }
    if(command.cooldown) {
        
      if(cooldown.has(`${command.name}${message.author.id}`)) return message.reply({ embeds:[{description:`**عليك الانتظار\`${ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), {long : true}).replace("minutes", `دقيقة`).replace("seconds", `ثانية`).replace("second", `ثانية`).replace("ms", `ملي ثانية`)}\` لكي تتمكن من استخدام الامر مجددا.**`}]}).then(msg => setTimeout(() => msg.delete(), cooldown.get(`${command.name}${message.author.id}`) - Date.now()))
      command.run(client, message, args)
      cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
      setTimeout(() => {
        cooldown.delete(`${command.name}${message.author.id}`)
      }, command.cooldown);
  } else {
    command.run(client, message, args)
  }}});


  client8.on('guildMemberAdd' , async(member) => {
    const dataFind = blacklistDB.get(`blacklisted_${member.guild.id}`)
    if(dataFind) {
      if(!dataFind.includes(member.user.id)) return;
      const roleFind = blacklistDB.get(`blacklist_role_${member.guild.id}`)
      if(roleFind) {
        try {
          member.roles.add(roleFind)
        } catch {
          return;
        }
      }
    }
  })
  client8.on("guildMemberAdd" , async(member) => {
    const guild = member.guild;
    let dataFind = blacklistDB.get(`blacklisted_${guild.id}`)
    if(!dataFind) {
      await blacklistDB.set(`blacklisted_${guild.id}` , [])
    }
    dataFind = blacklistDB.get(`blacklisted_${guild.id}`)
    const roleFind = blacklistDB.get(`blacklist_role_${guild.id}`)
    if(!roleFind) {
      return;
    }
    if(dataFind.includes(member.user.id)) {
      await member.roles.add(roleFind)
    }
  } )

  client8.on('guildMemberUpdate', async (oldMember, newMember) => {
    const guild = oldMember.guild;
    const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));
    if (removedRoles.size > 0 && blacklistDB.get(`blacklist_role_${guild.id}`)) {
      let roleRemoveLog1 = blacklistDB.get(`blacklist_role_${guild.id}`)
      
      const fetchedLogs = await guild.fetchAuditLogs({
        limit: removedRoles.size,
        type: AuditLogEvent.MemberRoleUpdate
      });
      
      removedRoles.forEach(async(role) => {
        let dataFind = blacklistDB.get(`blacklisted_${guild.id}`)
        if(!dataFind) {
          await blacklistDB.set(`blacklisted_${guild.id}` , [])
        }
        dataFind = blacklistDB.get(`blacklisted_${guild.id}`)
        const roleFind = blacklistDB.get(`blacklist_role_${guild.id}`)
        if(!roleFind) {
          return;
        }
        if(dataFind.includes(newMember.user.id)) {
          await newMember.roles.add(roleFind)
        }
      });
    }
  });


   client8.login(token)
   .catch(async(err) => {
    const filtered = blacklist.filter(bo => bo != data)
			await tokens.set(`blacklist` , filtered)
      console.log(`${clientId} Not working and removed `)
   });
})