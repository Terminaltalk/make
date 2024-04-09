const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, MessageComponentCollector, ButtonStyle } = require("discord.js");
const { Database } = require("st.db");
const { createCanvas, loadImage } = require('canvas')
const usersdata = new Database(`/database/usersdata/usersdata`)

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View your profile or the mentioned user\'s profile')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose profile you want to view')
                .setRequired(false)
        ),
    async execute(interaction, client) {
        try {
            await interaction.deferReply({ ephemeral: false });

            // Check if a user is mentioned, if not, use the user who used the command
            const targetUser = interaction.options.getUser('user') || interaction.user;

            let userbalance = usersdata.get(`balance_${targetUser.id}_${interaction.guild.id}`) ?? 0;
            let userbots = usersdata.get(`bots_${targetUser.id}_${interaction.guild.id}`) ?? 0;
            let usersub = usersdata.get(`sub_${targetUser.id}`);
            let userstatus = usersub ? "مشترك" : "غير مشترك";

            let avatar1 = await targetUser.displayAvatarURL({ dynamic: false, format: 'jpg' });
            let avatar2 = avatar1.slice(0, -4);
            avatar2 += "jpg";
            const avatar = await loadImage(avatar2);
            const canvas = createCanvas(608, 608);
            const ctx = canvas.getContext("2d");

            const profilebackground = "https://cdn.discordapp.com/attachments/1170194958209253386/1170194988450189454/Picsart_23-11-04_04-56-19-787.jpg?ex=65582802&is=6545b302&hm=7de2523f4a2a905576b2bfccada1203027261c27e51161227cb0942ab961c7b0&"
            const background = await loadImage(profilebackground);

            let sizeX = 165;
            let sizeY = sizeX;
            let z = 110;
            let x = z - sizeX / 2;
            let y = z - sizeY / 2;

            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.filter = "blur(10px)";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font = "bold 40px arial";
            ctx.strokeStyle = "#ffffff"; // Stroke color
            ctx.lineWidth = 2; // Stroke width
            ctx.fillText(targetUser.username, 350, 125);
            ctx.font = "bold 25px jazeel";
            ctx.textAlign = "left";
            ctx.font = "40px jazeel";
            ctx.fillStyle = "#ffffff";
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 40px arial";
            ctx.fillText(`${userbalance}`, 45, 200 + 110 + 35);
            ctx.fillText(`${userbots}`, 45, 200 + 220 + 35);
            ctx.font = "bold 40px jazeel"
            ctx.fillText(`${userstatus}`, 45, 110 + 420 + 35);

            /* -------------- */
            ctx.beginPath();
            ctx.arc(z, z, sizeY / 2, 0, 2 * Math.PI);
            ctx.strokeStyle = "white";
            ctx.stroke();
            ctx.closePath();
            ctx.save();
            ctx.clip();
            ctx.drawImage(avatar, 27.5, 27.5, sizeX, sizeY);
            ctx.restore();

            const thefinal = canvas.toBuffer();
            return interaction.editReply({ files: [{ attachment: thefinal, name: `profile.png` }] });
        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: '**An error occurred. Please try again.**' });
        }
    }
}
