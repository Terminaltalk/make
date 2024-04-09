const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");const { Database } = require("st.db")
const db = new Database("/database/settings")
const tokens = new Database("/database/tokens")
const invoices = new Database("/database/settingsdata/invoices");
const { clientId,owner} = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('show-invoice')
    .setDescription('Invoice Inquiry')
    .addStringOption(Option => Option
        .setName(`theinvoice`)
        .setDescription(`invoice`)
        .setRequired(true))
    ,
    async execute(interaction) {
            const invoice = interaction.options.getString(`theinvoice`)
            const theinv = invoices.get(`${invoice}_${interaction.guild.id}`)
            if(!theinv) return interaction.reply({content:`**هذه الفاتورة غير متوفرة**`})
            const embed = new EmbedBuilder()
        .setTitle(`**Billing information**`)
        .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setTimestamp(Date.now())
        .setColor('#000000')
        .addFields(
            {
                name:`**Buyer**`,value:`**<@${theinv.userid}>**`,inline:false
            },
            {
                name:`**Server**`,value:`**\`\`\`${interaction.guild.name}\`\`\`**`,inline:false
            },
            {
                name:`**Bot**`,value:`**\`\`\`${theinv.type}\`\`\`**`,inline:false
            },
            {
                name:`**Token**`,value:`**\`\`\`${theinv.token}\`\`\`**`,inline:false
            },
            {
                name:`**Prefix**`,value:`**\`\`\`${theinv.prefix}\`\`\`**`,inline:false
            },
            {
                name:`**id Server**`,value:`**\`\`\`${theinv.serverid}\`\`\`**`,inline:false
            },
            {
                name:`**Price**`,value:`**\`\`\`${theinv.price}\`\`\`**`,inline:false
            }
        )
        return interaction.reply({embeds:[embed]})
    }
}