const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/database/usersdata/codes");
const { owner } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-code')
        .setDescription('مسح كود')
        .addStringOption(Option =>
            Option
                .setName('code')
                .setDescription('code')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const thecode = interaction.options.getString(`code`);
        let codes = db.get(`codes_${interaction.guild.id}`);
        if (!codes) {
            await db.set(`codes_${interaction.guild.id}`, []);
        }
        codes = await db.get(`codes_${interaction.guild.id}`);
        let ownerFind = codes.find(re => re.code == thecode);
        if (interaction.user.id !== owner) {
            return interaction.editReply({ content: `You cannot use this command!` });
        }
        if (!ownerFind) return interaction.editReply({ content: `**This code is not available for removal**` });
        const filtered = codes.filter(re => re.code != thecode);
        await db.set(`codes_${interaction.guild.id}`, filtered);
        return interaction.editReply({ content: `**Code deleted successfully**` });

    }
}
