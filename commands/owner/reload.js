const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('[DEV] Reloads a command')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('Name of the command')
				.setRequired(true))
        .addStringOption(option =>
            option.setName('category')
            .setDescription('Category of the command')
            .setRequired(true)),   
	async execute(interaction) {
		const commandName = interaction.options.getString('command', true).toLowerCase();
        const category = interaction.options.getString('category', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

        if(!interaction.user.id === process.env.OWNER_ID) return interaction.reply(`:x: | You dont have permissions to run this command!`)
        
		if (!command) {
			return interaction.reply(`The command \`${commandName}\` does not exist!`);
		}

        delete require.cache[require.resolve(`../${category}/${command.data.name}.js`)];

        try {
            interaction.client.commands.delete(command.data.name);
            const newCommand = require(`../${category}/${command.data.name}.js`);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Command \`${newCommand.data.name}\` reloaded!`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
        }

	},
};
