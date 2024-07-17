/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/log', 'N/record', 'N/search', 'N/ui/serverWidget', 'N/url'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 * @param{url} url
 */
    (log, record, search, serverWidget, url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            log.error('Request Parameters', scriptContext.request.parameters);
            if (scriptContext.request.method === 'GET') {
                try {
                    let internalId = scriptContext.request.parameters.internalid;
                    log.error({
                        title: 'Internal Id',
                        details: internalId
                    });
                    let form = serverWidget.createForm({   //creating a form to display and edit values
                        title: 'Schedule Phone Call'
                    });
                     idField=form.addField({
                        id: 'custpage_internalid',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Internal ID'
                    });
                    idField.updateDisplayType({
                        displayType: serverWidget.FieldDisplayType.HIDDEN
                    });
                    const subject = form.addField({
                        id: 'custpage_subject',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Subject'
                    });
                    subject.isMandatory = true;
                    const status = form.addField({
                        id: 'custpage_status',
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
                        id: 'custpage_organizer',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Organizer',
                        source: 'employee'
                    });
                    organizer.isMandatory = true;
                    const phone = form.addField({
                        id: 'custpage_phone',
                        type: serverWidget.FieldType.PHONE,
                        label: 'Phone'
                    });
                    const accessLevel = form.addField({
                        id: 'custpage_accesslevel',
                        type: serverWidget.FieldType.CHECKBOX,
                        label: 'PRIVATE PHONE CALL'
                    });
                    const date = form.addField({
                        id: 'custpage_date',
                        type: serverWidget.FieldType.DATE,
                        label: 'Date'
                    });
                    date.isMandatory = true;
                    const dateCompleted = form.addField({
                        id: 'custpage_date_completed',
                        type: serverWidget.FieldType.DATE,
                        label: 'Date Completed'
                    });
                    const startTime = form.addField({
                        id: 'custpage_start_time',
                        type: serverWidget.FieldType.TIMEOFDAY,
                        label: 'Start Time'
                    });
                    const endTime = form.addField({
                        id: 'custpage_end_time',
                        type: serverWidget.FieldType.TIMEOFDAY,
                        label: 'End Time'
                    });
                    const lead = form.addField({
                        id: 'custpage_lead',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Lead',
                        source: 'lead'
                    });
                    const contact = form.addField({
                        id: 'custpage_contact',
                        type: serverWidget.FieldType.SELECT,
                        label: 'Contact',
                        source: 'contact'
                    });
                    let phoneCallRec = record.load({
                        type: record.Type.PHONE_CALL,
                        id: internalId,
                        isDynamic: true
                    });
                    idField.defaultValue = internalId;
                    subject.defaultValue = phoneCallRec.getValue('title');
                    status.defaultValue = phoneCallRec.getValue('status');
                    organizer.defaultValue = phoneCallRec.getValue('assigned');
                    phone.defaultValue = phoneCallRec.getValue('phone');
                    if (phoneCallRec.getValue('accesslevel')) {
                        accessLevel.defaultValue = 'T';
                    }
                    else {
                        accessLevel.defaultValue = 'F';
                    }
                    date.defaultValue = phoneCallRec.getValue('startdate');
                    dateCompleted.defaultValue = phoneCallRec.getValue('completeddate');
                    log.error({
                        title: 'Start time',
                        details: phoneCallRec.getValue('starttime')
                    });
                    function formatTime(timeString) {
                        if (!timeString) return '';
                        let dateObj = new Date(timeString);
                        let hours = dateObj.getHours();
                        let minutes = dateObj.getMinutes();
                        let period = 'AM';
                        if (hours >= 12) {
                            period = 'PM';
                            if (hours > 12) {
                                hours -= 12;
                            }
                        }
                        if (hours === 0) {
                            hours = 12;
                        }
                        return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
                    }
                    startTime.defaultValue = formatTime(phoneCallRec.getValue('starttime'));
                    endTime.defaultValue = formatTime(phoneCallRec.getValue('endtime'));
                    log.error({
                        title: 'Lead',
                        details: phoneCallRec.getValue('company')
                    });
                    lead.defaultValue = phoneCallRec.getValue('company');
                    contact.defaultValue = phoneCallRec.getValue('contact');
                    form.addSubmitButton({
                        label: 'Submit'
                    });

                    scriptContext.response.writePage(form);
                }
                catch (error) {
                    log.error({
                        title: 'Error in creating and getting values',
                        details: error
                    })
                }
            }
            else if (scriptContext.request.method === 'POST') {
                try {
                    let data = scriptContext.request;    //getting the details from the form
                    let id = data.parameters.custpage_internalid;
                    let subject = data.parameters.custpage_subject;
                    let statuss = data.parameters.custpage_status;
                    let organizer = data.parameters.custpage_organizer;
                    let phone = data.parameters.custpage_phone;
                    let accessLevel = data.parameters.custpage_accesslevel;
                    let date = new Date(data.parameters.custpage_date);   //parsing the date into netsuite format
                    let dateCompleted = new Date(data.parameters.custpage_date_completed) || null;
                    let startTime = data.parameters.custpage_start_time;
                    let endTime = data.parameters.custpage_end_time;
                    let lead = data.parameters.custpage_lead;
                    let contact = data.parameters.custpage_contact;
                    log.error({
                        title: 'Internal Id',
                        details: id
                    });
                    let custrec = record.load({
                        type: record.Type.PHONE_CALL,
                        id: id,
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
                        value: dateCompleted || null,
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
                    custrec.save({    //saving the newly created phone call record
                        enableSourcing: true,
                        ignoreMandatoryField: true
                    });
                    scriptContext.response.write(`The Phone call record with id: ${id} has been updated.`);
                    log.error({
                        title: 'Record Created',
                        details: `Phone Call record with id ${id} has been updated`
                    });
                }
                catch (error) {
                    log.error({
                        title: "Error in setting block",
                        details: error
                    });
                }
            }
        }

        return { onRequest }

    });
