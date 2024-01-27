const { SlashCommandBuilder, CommandInteraction, Client } = require('discord.js');

// Getting the user schema
const User = require('../../Schemas/UserSchema');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('atm')
		.setDescription('View your wallet!')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('View the wallet of a specific user')),
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
	async execute(interaction, client) {
        // User to be used for the command
        // If the command author did not use the "user" option, the "user" will be the author themselves
        const user = interaction.options.getUser('user') || interaction.user;

        // Get the user's database
        // If the user's database does not exist, create a new one with their ID
        const db = await User.findOne({ userId: user.id }) || new User({ userId: user.id });
        
        // Sending the message to the user: @author, [@user/You] have 10 Coins!
        // ${interaction.user.id === user.id ? "You" : `${user}`} = If the user ID in the "user" const is the same as the author's
        //                                                           ID of the command, it will display "You", otherwise, it will mention
        //                                                           the user they specified in the "user" option
		await interaction.reply(`${interaction.user}, ${interaction.user.id === user.id ? "You" : `${user}`} have **${db.economy.coins.toLocaleString()}** Coins!`);
	},
};
