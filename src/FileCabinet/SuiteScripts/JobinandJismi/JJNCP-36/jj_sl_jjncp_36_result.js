/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/file', 'N/log', 'N/record', 'N/search', 'N/ui/serverWidget', 'N/url'],
    /**
 * @param{file} file
 * @param{log} log
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (file, log, record, search, serverWidget, url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                try {
                    let form = serverWidget.createForm({
                        title: 'Phone call records'
                    });
                    let sublist = form.addSublist({
                        id: 'details',
                        label: "Details",
                        type: serverWidget.SublistType.LIST
                    });
                    sublist.addField({
                        id: 'custpage_edit',
                        label: 'Edit',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'custpage_internalid',
                        label: 'Internal Id',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'custpage_subject',
                        label: 'Subject',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'custpage_status',
                        label: 'Status',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'custpage_date',
                        label: 'Date',
                        type: serverWidget.FieldType.DATE
                    });
                    sublist.addField({
                        id: 'custpage_phone',
                        label: 'Phone Number',
                        type: serverWidget.FieldType.PHONE
                    });
                    let filters = [
                        ["assigned", "anyof", "-5"]
                    ];
                    let searchResult = search.create({
                        type: search.Type.PHONE_CALL,
                        filters: filters,
                        columns: [
                            search.createColumn({ name: "internalid", label: "Internal Id" }),
                            search.createColumn({ name: "title", label: "Subject" }),
                            search.createColumn({ name: "status", label: "Status" }),
                            search.createColumn({ name: "startdate", label: "Date" }),
                            search.createColumn({ name: "phone", label: "Phone Number" }),
                            search.createColumn({ name: "assigned", label: "Organizer" }),
                            search.createColumn({ name: "company", label: "Company" })
                        ]
                    });
                    let i = 0;
                    searchResult.run().each(function (result) {
                        let internalId = result.getValue('internalid');
                        let subject = result.getValue('title');
                        let status = result.getValue('status');
                        let date = result.getValue('startdate');
                        let phone = result.getValue('phone');
                        let suiteletUrl = url.resolveScript({
                            scriptId: 'customscript_jj_sl_jjncp_36_edit',
                            deploymentId: 'customdeploy_jj_sl_jjncp_36_edit',
                            params: {
                                'internalid': internalId
                            },
                            returnExternalUrl: true
                        });
                        log.error("internal Id: " + internalId);
                        log.error(suiteletUrl);
                        sublist.setSublistValue({
                            id: 'custpage_edit',
                            line: i,
                            value: `<a href="${suiteletUrl}">edit</a>`
                        });
                        sublist.setSublistValue({
                            id: 'custpage_internalid',
                            line: i,
                            value: internalId
                        });

                        sublist.setSublistValue({
                            id: 'custpage_subject',
                            line: i,
                            value: subject
                        });
                        sublist.setSublistValue({
                            id: 'custpage_status',
                            line: i,
                            value: status
                        });
                        sublist.setSublistValue({
                            id: 'custpage_date',
                            line: i,
                            value: date
                        });
                        sublist.setSublistValue({
                            id: 'custpage_phone',
                            line: i,
                            value: phone || null
                        });
                        i++;
                        return true;
                    });
                    scriptContext.response.writePage(form);
                }
                catch (error) {
                    log.error({
                        title: "ERROR",
                        details: error
                    });
                }
            }
        }

        return { onRequest }

    });
