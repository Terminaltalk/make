const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Permissions } = require("discord.js");
const { Database } = require("st.db");
const { owner } = require('../../config.json');
const setting = new Database("/database/settingsdata/setting");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send-balance-panel')
        .setDescription(`لكي ترسل بنل شراء العملات`)
        .addChannelOption(option =>
            option.setName('room')
                .setDescription('الروم الذي سيتم إرسال الرسالة إليه')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });

        const roomId = interaction.options.getChannel('room').id;
        let theroom = interaction.guild.channels.cache.get(roomId);

        if (!theroom) {
            return interaction.editReply({ content: `**The specified room was not found**` });
        }

        const buyBalanceButton = new ButtonBuilder()
            .setCustomId('BuyBalanceButton')
            .setLabel('شراء عملات')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(buyBalanceButton);

        theroom.send({ content: '****لكي تشتري عملات , اضغط علي زر `شراء عملات`****', components: [row] });

        if (interaction.user.id !== owner) {
            return interaction.editReply({ content: `**You cannot use this command!**` });
        }

        return interaction.editReply({ content: `**The message has been sent successfully**` });
    },
};
