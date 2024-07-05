/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
/**********************************************************************************
 * OTP-7457 : External custom record form and actions
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
 * Date Created: 04-July-2024
 *
 * Description: This script is for creating new records from the data entered from the external form.
 *
 *
 * REVISION HISTORY
 *
 * @version 1.0 company name: 04-July-2024: Created the initial build by JJ0355
 *
 *
 *
 **************/
define(['N/email', 'N/log', 'N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{email} email
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (email, log, record, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                let form = serverWidget.createForm({
                    title: 'Custom Form'
                });
                const name = form.addField({
                    id: 'name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Name'
                });
                const email = form.addField({
                    id: 'email',
                    type: serverWidget.FieldType.EMAIL,
                    label: 'Email'
                });
                const customer = form.addField({
                    id: 'customer',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer'
                });
                const subject = form.addField({
                    id: 'subject',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Subject'
                });
                const message = form.addField({
                    id: 'message',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Message'
                });
                form.addSubmitButton({
                    label: 'Submit'
                });
                scriptContext.response.writePage(form);
            }
            else if (scriptContext.request.method === 'POST') {
                try {
                    var data = scriptContext.request;
                    let name = data.parameters.name;
                    let formemail = data.parameters.email;
                    let subject = data.parameters.subject;
                    let message = data.parameters.message;
                    let searchresult = search.create({
                        type: search.Type.CUSTOMER,
                        filters: ['email', 'is', formemail],
                        columns: ['internalid', 'email', 'salesrep']
                    });
                    let salesrep;
                    let customerid;
                    searchresult.run().each(function (result) {
                        salesrep = result.getValue('salesrep');
                        customerid = result.getValue('internalid');
                    });
                    let customer=record.load({
                        type: record.Type.CUSTOMER,
                        id: customerid,
                        isDynamic: true
                    });
                    let customername=customer.getText('entityid');
                    let custrec = record.create({
                        type: 'customrecord_jj_custom_customer_rec',
                        isDynamic: true
                    });
                    custrec.setValue({
                        fieldId: 'custrecord_jj__name',
                        value: name,
                        ignoreFieldChange: true
                    });
                    custrec.setValue({
                        fieldId: 'custrecord_jj__email',
                        value: formemail,
                        ignoreFieldChange: true
                    });
                    custrec.setValue({
                        fieldId: 'custrecord_jj__customer',
                        value: customername,
                        ignoreFieldChange: true
                    });
                    custrec.setValue({
                        fieldId: 'custrecord_jj__subject',
                        value: subject,
                        ignoreFieldChange: true
                    });
                    custrec.setValue({
                        fieldId: 'custrecord_jj__message',
                        value: message,
                        ignoreFieldChange: true
                    });
                    let id = custrec.save({
                        enableSourcing: true,
                        ignoreMandatoryField: true
                    });
                    log.error("salesrep:" + salesrep);
                    log.error("customer:" + customername);
                    if (salesrep) {
                        email.send({
                            author: -5,
                            body: `A custom customer record has been created with the email of customer:${customername}`,
                            recipients: salesrep,
                            subject: 'A custom record creation'
                        });
                    }
                    email.send({
                        author: -5,
                        body: `A custom customer record with id ${id} has been created.`,
                        recipients: -5,
                        subject: 'A custom record creation'
                    });
                    scriptContext.response.write(`A custom customer record with id ${id} has been created.`);
                }
                catch (error) {
                    log.error(error);
                }
            }
        }
            return { onRequest }

        });
