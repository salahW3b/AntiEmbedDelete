const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const QuickDB = require('quick.db');
const db = new QuickDB();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const salon = '';

client.on('ready', () => {
    console.log(`Connecté sur ${client.user.tag} !`);
});

client.on('messageDelete', async message => {
    if (!message.embeds.length) return;

    const embed = new EmbedBuilder()
        .setDescription(`\\✏️ Cette embed a été supprimé dans le salon <#${message.channel.id}>`)
        .setFooter({ text: 'discord.gg/novaworld' })
        .setColor('2f3136');

    db.set(message.channel.id, message.embeds[0].toJSON());

    const button = new ButtonBuilder()
        .setCustomId(message.channel.id)
        .setLabel('📜')
        .setStyle(1);

    const button2 = new ButtonBuilder()
        .setCustomId(message.channel.id)
        .setLabel('📜')
        .setStyle(1)
        .setDisabled(true);

    const row = new ActionRowBuilder().addComponents([button]);
    const row2 = new ActionRowBuilder().addComponents([button2]);

    client.channels.cache.get(salon).send({ content: `Salon: <#${message.channel.id}>`, embeds: [message.embeds[0].toJSON()] });
    client.channels.cache.get(salon).send({ embeds: [embed], components: [row] });

    client.on('interactionCreate', async interaction => {
        if (interaction.isButton()) {
            interaction.message.edit({ components: [row2] });
            interaction.reply({
                ephemeral: false,
                embeds: [new EmbedBuilder().setDescription(`✅ J'ai bien envoyé le message dans le salon.`)]
            });

            const channel = interaction.guild.channels.cache.get(interaction.customId);
            if (channel) channel.send({ embeds: [new EmbedBuilder(db.get(interaction.customId))] });
        }
    });
});

client.login('token');
