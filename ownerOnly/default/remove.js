const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, MessageComponentCollector, ButtonStyle } = require("discord.js");
const { Database } = require("st.db");

const usersdata = new Database(`/database/usersdata/usersdata`);
const { owner } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-coins')
        .setDescription('حذف عملات')
        .addUserOption(Option => Option
            .setName(`user`)
            .setDescription(`The person from whom the balance is to be deleted is the balance`)
            .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`quantity`)
            .setDescription(`amount`)
            .setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });
        let balanceembed = new EmbedBuilder()
            .setColor(`Gold`)
            .setTimestamp();
        let user = interaction.options.getUser(`user`);
        let quantity = interaction.options.getInteger(`quantity`);
        let userbalance = usersdata.get(`balance_${user.id}_${interaction.guild.id}`);
        if (!userbalance) {
            await usersdata.set(`balance_${user.id}_${interaction.guild.id}`, 0);
            balanceembed.setDescription(`**This person's balance is less than the balance you want to remove**`);
        } else if (parseInt(userbalance) < parseInt(quantity)) {
            balanceembed.setDescription(`**This person's balance is less than the balance you want to remove**`);
        } else {
            let newuserbalance = parseInt(userbalance) - parseInt(quantity);
            await usersdata.set(`balance_${user.id}_${interaction.guild.id}`, newuserbalance);
            userbalance = usersdata.get(`balance_${user.id}_${interaction.guild.id}`);
            balanceembed.setDescription(`**has been discount${user} Balance successfully \n His current balance is: \`${userbalance}\`**`);
        }
        if (interaction.user.id !== owner) {
            return interaction.editReply({ content: `You cannot use this command!` });
        }
        return interaction.editReply({ embeds: [balanceembed] });
    }
}
