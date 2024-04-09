const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/database/usersdata/codes");
const { owner } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generat-code')
        .setDescription('انشاء كود')
        .addStringOption(Option => Option
            .setName(`code`)
            .setDescription(`Code`)
            .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`usergift`)
            .setDescription(`Code user gift`)
            .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`maxuse`)
            .setDescription(`Maximum number of users`)
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const code = interaction.options.getString(`code`);
        const usergift = interaction.options.getInteger(`usergift`);
        const maxuse = interaction.options.getInteger(`maxuse`);
        let codes = db.get(`codes_${interaction.guild.id}`);
        if (!codes) {
            await db.set(`codes_${interaction.guild.id}`, []);
        }
        codes = await db.get(`codes_${interaction.guild.id}`);
        if (interaction.user.id !== owner) {
            return interaction.editReply({ content: `You cannot use this command!` });
        }
        await codes.push({
            code: code,
            usergift: usergift,
            maxuse: maxuse,
            users: [],
            usersnow: 0
        });
        await db.set(`codes_${interaction.guild.id}`, codes);
        return interaction.editReply({ content: `**The discount code was created successfully**` });

    }
}
