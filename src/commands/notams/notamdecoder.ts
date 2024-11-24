import { ActionRowBuilder, CommandInteraction, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import type { Command } from '../../types/Command';
import notamDecoder from '../../services/notams.services/notamdecoder.service';

const storymodal: Command = {
	data: new SlashCommandBuilder()
		.setName('notamdecoder')
		.setDescription('Decode Notams with the standard format'),


	async execute(interaction: CommandInteraction) { 

        const modal = new ModalBuilder({
            customId: `notamDecodeModal-${interaction.user.id}`,
            title: "Notam Decoder",
            
        });

    
        const notamContentInput = new TextInputBuilder({
            custom_id: `notamContentInput`,
            label: `Notam (Full Text)`,
            style: TextInputStyle.Paragraph
        });

        const contentActionRow:any = new ActionRowBuilder().addComponents(notamContentInput);

        modal.addComponents( contentActionRow);

        await interaction.showModal(modal);

        const filter = (interaction:ModalSubmitInteraction) => interaction.customId === `notamDecodeModal-${interaction.user.id}`;
        interaction.awaitModalSubmit({filter, time: 30_000})
        .then((modalInteraction) => {
            const notamContentValue = modalInteraction.fields.getTextInputValue("notamContentInput");

            
        //@ts-ignore
        var notam = notamDecoder.decode(notamContentValue)

            modalInteraction.reply(`NOTAM: \n\n${JSON.stringify(notam, null, 4)}`);
        });

      

	},
	cooldown: 4
};



export default storymodal;
