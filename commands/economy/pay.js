const Discord = require('discord.js');
const { SlashCommandBuilder, CommandInteraction, Client } = require('discord.js');

// Getting the user schema
const User = require('../../Schemas/UserSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Pay coins to someone')
        .addUserOption(option =>
            option.setName('user')
                .setDescription(`User you will send coins to`)
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('amount')
                .setDescription(`Amount of coins to be sent`)
                .setRequired(true)),
    /**
     * 
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        // Getting the user from the "user" option
        const user = interaction.options.getUser('user');

        // Getting the number from the "amount" option
        const amount = interaction.options.getNumber('amount');

        // Getting the database of the mentioned user
        const db_user = await User.findOne({ userId: user.id }) || new User({ userId: user.id });

        // Getting the database of the author
        const db = await User.findOne({ userId: interaction.user.id }) || new User({ userId: interaction.user.id });

        const amountString = amount.toString();

        if (amountString.startsWith("-") || amountString.includes("-")) return interaction.reply(`:x: | The amount cannot be negative!`);

        if (db.economy.coins >= amount) {
            // Creating the accept button
            const btn_accept = new Discord.ButtonBuilder()
                .setLabel(`- Send payment`)
                .setCustomId('accept')
                .setEmoji(`✅`)
                .setStyle(Discord.ButtonStyle.Success);
            
            // Creating the action row and adding the button
            const row = new Discord.ActionRowBuilder().addComponents(btn_accept);
            
            // Sending the message
            interaction.reply({ content: `${interaction.user}, you are about to send **${amount.toLocaleString()} Coins** to ${user}! Click the button below to confirm the payment.`, components: [row] }).then(async (msg) => {
                // Creating the button collector
                const collector = interaction.channel.createMessageComponentCollector().on('collect', async (i) => {
                    // Checking if the button id is accept
                    if (i.customId === 'accept') {
                        // Sending a message indicating that the user is not the message author to use the button
                        if (i.user.id !== interaction.user.id) return i.reply({ ephemeral: true, content: `:x: | You are not ${interaction.user} to use this button!` });
                        
                        btn_accept.setDisabled(true); // Disabling the button to prevent further use
                        msg.edit({ content: `:white_check_mark: | ${interaction.user} sent **${amount.toLocaleString()} Coins** to ${user}!`, components: [row] });
                        db_user.economy.coins += amount; // Adding coins to the user
                        db.economy.coins -= amount; // Removing coins from the author
                        db.save(); // Saving the author's database
                        db_user.save(); // Saving the user's database
                        i.deferUpdate();
                    }
                });
            });
        }
    }
};
