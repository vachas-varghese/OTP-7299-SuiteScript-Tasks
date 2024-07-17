/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *  @NModuleScope SameAccount
 */
/**********************************************************************************
 * JJNCP-34 : Develop Phone call management module
 *
 *
 * ********************************************************************************
 *
 * ********************
 * company name
 *
 * Author: Jobin and Jismi IT Services
 *
 *
 * Date Created: 16-July-2024
 *
 * Description: This script is for creating a form and creating a phone call record using the details from the phone.
 *
 *
 * REVISION HISTORY
 *
 * @version 1.0 company name: 16-July-2024: Created the initial build by JJ0355
 *
 *
 *
 **************/
define(['N/file', 'N/log', 'N/record', 'N/search', 'N/task', 'N/ui/serverWidget', 'N/url'],
    /**
 * @param{file} file
 * @param{log} log
 * @param{record} record
 * @param{search} search
 * @param{task} task
 * @param{serverWidget} serverWidget
 * @param{url} url
 */
    (file, log, record, search, task, serverWidget, url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                let form = serverWidget.createForm({   //creating a form and accepting values
                    title: 'Schedule Phone Call'
                });
                const subject = form.addField({
                    id: 'subject',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Subject'
                });
                subject.isMandatory = true;
                const status = form.addField({
                    id: 'status',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Status'
                });
                status.addSelectOption({
                    value: '',
                    text: '--Select Status--'
                });
                status.addSelectOption({
                    value: 'SCHEDULED',
                    text: 'Scheduled'
                });
                status.addSelectOption({
                    value: 'COMPLETE',
                    text: 'Completed'
                });
                status.isMandatory = true;
                const organizer = form.addField({
                    id: 'organizer',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Organizer',
                    source: 'employee'
                });
                organizer.isMandatory = true;
                const phone = form.addField({
                    id: 'phone',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone'
                });
                const accessLevel = form.addField({
                    id: 'accesslevel',
                    type: serverWidget.FieldType.CHECKBOX,
                    label: 'PRIVATE PHONE CALL'
                });
                const date = form.addField({
                    id: 'date',
                    type: serverWidget.FieldType.DATE,
                    label: 'Date'
                });
                date.isMandatory = true;
                const dateCompleted = form.addField({
                    id: 'date_completed',
                    type: serverWidget.FieldType.DATE,
                    label: 'Date Completed'
                });
                const startTime = form.addField({
                    id: 'start_time',
                    type: serverWidget.FieldType.TIMEOFDAY,
                    label: 'Start Time'
                });
                const endTime = form.addField({
                    id: 'end_time',
                    type: serverWidget.FieldType.TIMEOFDAY,
                    label: 'End Time'
                });
                const lead = form.addField({
                    id: 'lead',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Lead',
                    source: 'lead'
                });
                const contact = form.addField({
                    id: 'contact',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Contact',
                    source: 'contact'
                });
                form.addSubmitButton({
                    label: 'Submit'
                });
                scriptContext.response.writePage(form);
            }
            else if (scriptContext.request.method === 'POST') {
                try {
                    let data = scriptContext.request;    //getting the details from the form
                    let subject = data.parameters.subject;
                    let statuss = data.parameters.status;
                    let organizer = data.parameters.organizer;
                    let phone = data.parameters.phone;
                    let accessLevel = data.parameters.accesslevel;
                    let date = new Date(data.parameters.date);   //parsing the date into netsuite format
                    let dateCompleted = new Date(data.parameters.date_completed) || null;
                    let startTime = data.parameters.start_time;
                    let endTime = data.parameters.end_time;
                    let lead = data.parameters.lead;
                    let contact = data.parameters.contact;
                    scriptContext.response.write(`<h4>Subject: ${subject} <br> Status: ${statuss} <br> Organizer: ${organizer} <br> Phone: ${phone} <br> Private phone call: ${accessLevel} <br> Date: ${date} <br> Date Completed: ${dateCompleted} <br> Start time: ${startTime} <br> End time: ${endTime} <br> Lead: ${lead} <br> Contact: ${contact} <br> </h4>`);
                    let custrec = record.create({    //creating a phone call record with the details
                        type: record.Type.PHONE_CALL,
                        isDynamic: true
                    });
                    custrec.setValue({
                        fieldId: 'title',
                        value: subject,
                        ignoreFieldChange: true
                    });
                    custrec.setValue({
                        fieldId: 'status',
                        value: statuss,
                        ignoreFieldChange: true
                    });
                    custrec.setValue({
                        fieldId: 'assigned',
                        value: organizer,
                        ignoreFieldChange: true
                    });
                    custrec.setValue({
                        fieldId: 'phone',
                        value: phone,
                        ignoreFieldChange: true
                    });
                    if (accessLevel === 'T') {
                        custrec.setValue({
                            fieldId: 'accesslevel',
                            value: true,
                            ignoreFieldChange: true
                        });
                    }
                    else {
                        custrec.setValue({
                            fieldId: 'accesslevel',
                            value: false,
                            ignoreFieldChange: true
                        });
                    }
                    custrec.setValue({
                        fieldId: 'startdate',
                        value: date,
                        ignoreFieldChange: true
                    });
                    custrec.setValue({
                        fieldId: 'completeddate',
                        value: dateCompleted,
                        ignoreFieldChange: true
                    });
                    if (startTime && endTime) {     //ticking the reserve time checkbox if both start and end time is entered
                        custrec.setValue({
                            fieldId: 'timedevent',
                            value: true,
                            ignoreFieldChange: true
                        });
                        let startTimeDate = new Date();    //Converting the start and end time to Netsuite format 
                        startTimeDate.setHours(parseInt(startTime.split(':')[0]));
                        startTimeDate.setMinutes(parseInt(startTime.split(':')[1]));

                        let endTimeDate = new Date();
                        endTimeDate.setHours(parseInt(endTime.split(':')[0]));
                        endTimeDate.setMinutes(parseInt(endTime.split(':')[1]));

                        custrec.setValue({
                            fieldId: 'starttime',
                            value: startTimeDate,
                            ignoreFieldChange: true
                        });

                        custrec.setValue({
                            fieldId: 'endtime',
                            value: endTimeDate,
                            ignoreFieldChange: true
                        });
                    }
                    custrec.setValue({
                        fieldId: 'company',
                        value: lead
                    });
                    if (contact) {
                        custrec.setValue({
                            fieldId: 'contact',
                            value: contact
                        });
                    }
                    let id = custrec.save({    //saving the newly created phone call record
                        enableSourcing: true,
                        ignoreMandatoryField: true
                    });
                    scriptContext.response.write(`A Phone call record with id: ${id} has been created.`);
                    log.error({
                        title: 'Record Created',
                        details: `Phone Call record with id ${id} has been created`
                    });
                }
                catch (error) {
                    log.error({
                        title: "Error in post block",
                        details: error
                    });
                }
            }

        }

        return { onRequest }

    });
