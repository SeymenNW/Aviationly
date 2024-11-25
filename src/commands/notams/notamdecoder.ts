import { ActionRowBuilder, CommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import type { Command } from '../../types/Command';
//@ts-ignore
import notamDecoder from '../../services/notams.services/notamdecoder.service';
import type { DecodedNotam } from '../../types/DecodedNotam';

const notamdecoder: Command = {
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

        const contentActionRow: any = new ActionRowBuilder().addComponents(notamContentInput);

        modal.addComponents(contentActionRow);

        await interaction.showModal(modal);

        const filter = (interaction: ModalSubmitInteraction) => interaction.customId === `notamDecodeModal-${interaction.user.id}`;
        interaction.awaitModalSubmit({ filter, time: 30_000 })
            .then((modalInteraction) => {
                const notamContentValue = modalInteraction.fields.getTextInputValue("notamContentInput");

                //@ts-ignore
                var notam = notamDecoder.decode(notamContentValue) as DecodedNotam;

                let notamEmbed = new EmbedBuilder();
                let embedError;

                try {
                    const headerInfo: string[] = [];
                    if (notam.header?.id) headerInfo.push(`**ID**: ${notam.header.id}`);
                    if (notam.header?.series) headerInfo.push(`**Series**: ${notam.header.series}`);
                    if (notam.header?.number) headerInfo.push(`**Number**: ${notam.header.number}`);
                    if (notam.header?.year) headerInfo.push(`**Year**: ${notam.header.year}`);
                    if (notam.header?.type) headerInfo.push(`**Type**: ${notam.header.type}`);
                    if (notam.header?.typeDesc) headerInfo.push(`**Type Description**: ${notam.header.typeDesc}`);

                    const scheduleInfo: string[] = [];
                    if (notam.schedule?.activityStart) scheduleInfo.push(`**Activity Start**: ${notam.schedule.activityStart}`);
                    if (notam.schedule?.validityEnd) scheduleInfo.push(`**Validity End**: ${notam.schedule.validityEnd}`);

                    const locAndCoordInfo: string[] = [];
                    if (notam.qualification?.location) locAndCoordInfo.push(`**Location**: ${notam.qualification.location}`);
                    if (notam.qualification?.coordinates?.lat) locAndCoordInfo.push(`**Latitude**: ${notam.qualification.coordinates.lat}`);
                    if (notam.qualification?.coordinates?.lng) locAndCoordInfo.push(`**Longitude**: ${notam.qualification.coordinates.lng}`);
                    if (notam.qualification?.coordinates?.radius) locAndCoordInfo.push(`**Radius**: ${notam.qualification.coordinates.radius}`);

                    const qualificationInfo: string[] = [];
                    if (notam.qualification?.code?.code) qualificationInfo.push(`**Line**: ${notam.qualification.code.code}`);
                    if (notam.qualification?.code?.entity) qualificationInfo.push(`**Entity**: ${notam.qualification.code.entity}`);
                    if (notam.qualification?.code?.status) qualificationInfo.push(`**Status**: ${notam.qualification.code.status}`);
                    if (notam.qualification?.code?.area) qualificationInfo.push(`**Area**: ${notam.qualification.code.area}`);
                    if (notam.qualification?.code?.subArea) qualificationInfo.push(`**Sub Area**: ${notam.qualification.code.subArea}`);
                    if (notam.qualification?.code?.subject) qualificationInfo.push(`**Subject**: ${notam.qualification.code.subject}`);
                    if (notam.qualification?.code?.condition) qualificationInfo.push(`**Condition**: ${notam.qualification.code.condition}`);
                    if (notam.qualification?.code?.modifier) qualificationInfo.push(`**Modifier**: ${notam.qualification.code.modifier}`);

                    notamEmbed
                        .setTitle("NOTAM Information")
                        .setDescription(`Detailed information for NOTAM: ${notam.header?.id || "Unknown"}`)
                        .addFields(
                            { name: `Header`, value: headerInfo.join("\n"), inline: false },
                            { name: `Schedule`, value:  scheduleInfo.join("\n"), inline: false },
                            { name: `Location & Coordinates`, value:  locAndCoordInfo.join("\n"), inline: false },
                            { name: `Qualification`, value:  qualificationInfo.join("\n"), inline: false },
                            { name: `Traffic Affected`, value: notam.qualification?.traffic?.map(trf => trf.description).join('\n'), inline: false },
                            { name: `Purpose`, value: notam.qualification?.purpose?.map(pur => pur.description).join('\n') , inline: true },
                            { name: `Scope`, value: notam.qualification?.scope?.map(sc => sc.description).join(`\n`) , inline: true },
                            { name: `Altitude Limits`, value: `Lower: ${notam.qualification?.limits?.lower}, Upper: ${notam.qualification?.limits?.upper}`, inline: false },
                            { name: `Content`, value: `\`\`\`${notam.content?.text}\`\`\`\n`, inline: false }
                        )
                        .setColor("#00eb46")
                        .setTimestamp();
                } catch (err) {
                    embedError = err;
                }

                if (embedError) {
                    modalInteraction.reply({ content: "Invalid NOTAM Provided.\n*only Non-US notams are supported*", ephemeral: true });
                } else {
                    modalInteraction.reply({ embeds: [notamEmbed] });
                }
            });
    },
    cooldown: 4
};

export default notamdecoder;
