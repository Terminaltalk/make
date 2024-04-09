const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/database/usersdata/codes");
const { owner } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show-server-codes')
        .setDescription('اظهار اكواد الخصم الموجوده في السيرفر'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        let codes = db.get(`codes_${interaction.guild.id}`);
        if (!codes) {
            await db.set(`codes_${interaction.guild.id}`, []);
        }
        codes = await db.get(`codes_${interaction.guild.id}`);
        if (!codes || codes.length <= 0) {
            return interaction.editReply({ content: `**There are no discount codes on this server**` });
        }
        const embed = new EmbedBuilder()
            .setColor(`Gold`)
            .setTitle(`**All discount codes on the server**`)
            .setTimestamp();
        if (interaction.user.id !== owner) {
            return interaction.editReply({ content: `You cannot use this command!` });
        }
        codes.forEach(async (referral) => {
            const { code, usergift, maxuse, users } = referral;
            let theusers = [];
            users.forEach(async (user) => {
                theusers.push(`<@${user}>`);
            });
            embed.addFields(
                {
                    name: `**---**`, value: `**Code : \`${code}\`\nUser gift: \`${usergift}\`\nMaximum number to use: \`${maxuse}\`\nNumber of users code: ${theusers.length > 0 ? theusers : "No Users"}**`, inline: false
                }
            );
        });
        return interaction.editReply({ embeds: [embed] });

    }
}
