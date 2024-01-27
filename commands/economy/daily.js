const { SlashCommandBuilder, CommandInteraction, Client } = require('discord.js');

// Getting the user schema
const User = require('../../Schemas/UserSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Receive your daily reward'),
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
	async execute(interaction, client) {

        // Get the user's database
        // If the user's database does not exist, create a new one with their ID
        const db = await User.findOne({ userId: interaction.user.id }) || new User({ userId: interaction.user.id });

        if (db.cooldowns.daily < Date.now() || !db.cooldowns.daily) {
            const max = 9000; // Maximum coins the user can receive
            const min = 1000; // Minimum coins the user can receive

            // Generate a random value between the "max" and "min" variables
            const reward = Math.floor(Math.random() * (max - min) + min);
            
            // Send the message when the user collects the daily reward
            interaction.reply(`${interaction.user} collected their daily reward and received **${reward.toLocaleString()} Coins**! Come back <t:${Math.floor(new Date().setHours(24) / 1000)}:R> to collect again.`);
            
            // Update the database
            db.cooldowns.daily = new Date().setHours(24); // Set the daily cooldown for the next midnight
            db.economy.coins += reward; // Add the coins to the user
            db.save(); // Save the database
        } else {
            // Cooldown error message
            return interaction.reply(`:x: | You can't collect your daily reward now! Come back <t:${Math.floor(db.cooldowns.daily / 1000)}:R>`);
        }
	},
};
