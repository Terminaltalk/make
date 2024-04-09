const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, MessageComponentCollector, ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const prices = new Database("/database/settingsdata/prices.json")
const { clientId, owner } = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('change-price-bot')
        .setDescription("تغيير سعر البوت")
        .addStringOption(Option =>
            Option
                .setName('bot-type')
                .setDescription('Bot type')
                .addChoices(
                    {
                        name: `Broadcast`, value: `Bc`
                    },
                    {
                        name: `Tax`, value: `tax`
                    },
                    {
                        name: `Scammers`, value: `scam`
                    },
                    {
                        name: `Logs`, value: `logs`
                    },
                    {
                        name: `Tickets`, value: `ticket`
                    },
                    {
                        name: `Suggestions`, value: `suggestions`
                    },
                    {
                        name: `Feedback`, value: `feedback`
                    },
                    {
                        name: `Probot Premium`, value: `probot`
                    },
                    {
                        name: `Blacklist`, value: `blacklist`
                    },

                    {
                        name: `Autoline`, value: `autoline`
                    },
                    {
                        name: `Bot Maker Prime`, value: `bot_maker`
                    },
                    {
                        name: `Balance`, value: `balance`
                    }
                )
                .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`price`)
            .setDescription(`Price`)
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const Bot_Type = interaction.options.getString(`bot-type`)
        const price = interaction.options.getInteger(`price`)
        await prices.set(`${Bot_Type}_price_${interaction.guild.id}`, price)
        if (interaction.user.id !== owner) {
            return interaction.editReply({ content: `You cannot use this command!` })
        }
        return interaction.editReply({ content: `**The price of the bot has been changed successfully**` })
    }
}
