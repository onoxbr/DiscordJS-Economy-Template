const Discord = require('discord.js')
const { SlashCommandBuilder, CommandInteraction } = require('discord.js')


const User = require('../../Schemas/UserSchema')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('See the global coin ranking'),
    /**
     
     * @param {CommandInteraction} interaction
     */
	async execute(interaction, client) {
        try {
            // Fetch top users from the database sorted by their scores
            const topUsers = await User.find().sort({ "economy.coins": -1 }).limit(10);

            // Construct the ranking message
            const embed = new Discord.EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('Global Ranking')
                .setDescription('Top 10 Users');

            // Iterate through the top users and add them to the embed
            topUsers.forEach((user, index) => {
                embed.addFields({ name: `${index + 1}. ${interaction.client.users.cache.get(user.userId).username}`, value: `**${user.economy.coins.toLocaleString()} Coins**`});
            });

            // Send the embed message
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching global ranking:', error);
            await interaction.reply({ content: 'Error fetching global ranking. Please try again later.', ephemeral: true });
        }
    }
}