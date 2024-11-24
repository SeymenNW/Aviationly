import { ActionRowBuilder, CommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import type { Command } from '../../types/Command';
//@ts-ignore
import notamDecoder from '../../services/notams.services/notamdecoder.service';
import type { DecodedNotam } from '../../types/DecodedNotam';

const storymodal: Command = {
	data: new SlashCommandBuilder()
		.setName('notamdecoder')
		.setDescription('Decode any Notam (Some Notam types are not compatible)'),


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
        var notam = notamDecoder.decode(notamContentValue) as DecodedNotam;



        let notamEmbed = new EmbedBuilder();

        let embedError;

        try {
        notamEmbed
        .setTitle("NOTAM Information")
        .setDescription(`Detailed information for NOTAM: ${notam.header.id}`)
        .addFields(
          {
            name: `Header`,
            value: `ID: ${notam.header.id}\nSeries: ${notam.header.series}\nNumber: ${notam.header.number}\nYear: ${notam.header.year}\nType: ${notam.header.type}\nType Description: ${notam.header.typeDesc}`,
            inline: false
          },
          {
            name: `Schedule`,
            value: `Activity Start: ${notam.schedule.activityStart}\nValidity End: ${notam.schedule.validityEnd}`,
            inline: false
          },
          {
            name: `Location & Coordinates`,
            value: `Location: ${notam.qualification.location}\nLatitude: ${notam.qualification.coordinates.lat}\nLongitude: ${notam.qualification.coordinates.lng}\nRadius: ${notam.qualification.coordinates.radius}`,
            inline: false
          },
          {
            name: `Qualification`,
            value: `Line: ${notam.qualification.code.code}\nEntity: ${notam.qualification.code.entity}\nStatus: ${notam.qualification.code.status}\nArea: ${notam.qualification.code.area}\nSub-Area: ${notam.qualification.code.subArea}\nSubject: ${notam.qualification.code.subject}\nCondition: ${notam.qualification.code.condition}\nModifier: ${notam.qualification.code.modifier}`,
            inline: false
          },
          {
            name: `Traffic Affected`,
            value: `${notam.qualification.traffic.map(trf => trf.description).join('\n')}`,
            inline: false
          },
          {
            name: `Purpose`,
            value: `${notam.qualification.purpose.map(pur => pur.description).join('\n')}`,
            inline: true
          },
          {
            name: `Scope`,
            value: `${notam.qualification.scope.map(sc => sc.description).join(`\n`)}`,
            inline: true
          },
          {
            name: `Altitude Limits`,
            value: `Lower: ${notam.qualification.limits.lower}, Upper: ${notam.qualification.limits.upper}`,
            inline: false
          },
          {
            name: `Content`,
            value: `${notam.content.text}`,
            inline: false
          }
        )
        .setColor("#00eb46")
        .setTimestamp();
    } catch (err) {
        embedError = err;
    }
            
        
       if (embedError){
        modalInteraction.reply({content: "Invalid NOTAM Provided.\n*only Non-US notams are supported*", ephemeral: true});

       } else {
        modalInteraction.reply({embeds: [notamEmbed]});

       }
       
        
        
          
    });

      

	},
	cooldown: 4
};



export default storymodal;
