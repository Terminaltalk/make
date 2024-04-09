const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const usersdata = new Database(`/database/usersdata/usersdata`);

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('coins')
        .setDescription('لروئية عدد عملاتك'),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false });

        let userbalance = usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`) || 0;

        let balanceembed = new EmbedBuilder()
            .setTitle(`**Your Balance is: \`${userbalance}\`**`)
            .setColor(`Gold`)
            .setTimestamp();

        // إرسال الرسالة في الخاص بالمستخدم
        interaction.user.send({ embeds: [balanceembed] })
            .then(() => {
                // إذا نجح إرسال الرسالة في الخاص، يمكنك تحديث الرد الأصلي برسالة تأكيد
                interaction.followUp({ content: 'Your balance has been sent in your dm.' });
            })
            .catch((error) => {
                console.error(`Failed to send private message: ${error}`);
                interaction.followUp({ content: 'There was a problem sending the balance in private.' });
            });
    }
};
