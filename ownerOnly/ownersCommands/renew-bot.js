const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");const { Database } = require("st.db")
const db = new Database("/database/settings")
const tokens = new Database("/tokens/tokens")
const { clientId,owner} = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('renew-subscription-bot')
    .setDescription('تجديد الاشتراك')
    .addStringOption(Option => Option
        .setName(`type`)
        .setDescription(`Bot type`)
        .setChoices(
            {
                name:`Broadcast` , value:`Bc`
            },
            {
                name:`Tax` , value:`tax`
            },
            {
                name:`Scammers` , value:`scam`
            },
            {
                name:`Logs` , value:`logs`
            },
            {
                name:`Tickets` , value:`ticket`
            },
            {
                name:`Suggestions` , value:`suggestions`
            },
            {
                name:`Feedback` , value:`feedback`
            },
            {
                name:`Probot Premium` , value:`probot`
            },
            {
                name:`Blacklist` , value:`blacklist`
            },
            
            {
                name:`Autoline` , value:`autoline`
            }
        )
        .setRequired(true))
    .addStringOption(Option => Option
        .setName(`clientid`)
        .setDescription(`اي دي البوت`)
        .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`days`)
            .setDescription(`الايام`)
            .setRequired(true))
    ,
    async execute(interaction) {
       if(!owner.includes(interaction.user.id)) return;
       const type = interaction.options.getString(`type`)
       const clientid = interaction.options.getString(`clientid`)
       const days = interaction.options.getInteger(`days`)
       const subsearch = await tokens.get(`${type}`)
       const serversearch = subsearch.find(su => su.clientId == clientid)
       if(!serversearch) {
        return interaction.reply({content:`**لم يتم العثور على اشتراك بهذا الايدي**`})
       }
       const daysByHours = Math.floor(parseInt(days) * 24)
       const daysByMins = Math.floor(parseInt(daysByHours) * 60)
       const daysBySecs = Math.floor(parseInt(daysByMins) * 60)
       let {timeleft} = serversearch;
       timeleft = timeleft + daysBySecs
       serversearch.timeleft = timeleft
       await tokens.set(`${type}` , subsearch)
       const doneembed = new EmbedBuilder()
       .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setTimestamp(Date.now())
        .setColor('#000000')
        .setTitle(`**تم تجديد الاشتراك واضافة الوقت بنجاح**`)
        .setDescription(`**عدد الايام المتبقية الأن : \`${Math.floor((timeleft / 60) / (60) / (24))}\`**`)
       return interaction.reply({embeds:[doneembed]})
    }
}