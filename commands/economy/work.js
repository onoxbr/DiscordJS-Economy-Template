const Discord = require('discord.js');
const { SlashCommandBuilder, CommandInteraction, Client } = require('discord.js');

// Getting the user schema
const User = require('../../Schemas/UserSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work to earn coins!'),
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {

        // Get the user's database
        // If their database doesn't exist, create a new one with their id
        const db = await User.findOne({ userId: interaction.user.id }) || new User({ userId: interaction.user.id });

        if (db.cooldowns.work < Date.now() || !db.cooldowns.work) {
            const max = 12000; // Maximum coins the user can receive
            const min = 2000; // Minimum coins the user can receive

            // Generate a random value between the "max" and "min" variables
            const reward = Math.floor(Math.random() * (max - min) + min);
            const minutes = 10; // Cooldown of work in minutes
            
            // Send the message when the user works
            interaction.reply(`${interaction.user} worked and received **${reward.toLocaleString()} Coins**! Come back <t:${Math.floor(new Date().setMinutes(new Date().getMinutes() + minutes) / 1000)}:R> to collect again.`);
            
            // Update the database
            db.cooldowns.work = new Date().setMinutes(new Date().getMinutes() + minutes); // Set the cooldown of work for the next ten minutes
            db.economy.coins += reward; // Add the coins to the user
            db.save(); // Save the database
        } else {
            // Cooldown error message
            return interaction.reply(`:x: | You can't work right now! Come back <t:${Math.floor(db.cooldowns.work / 1000)}:R>`);
        }
    },
};
