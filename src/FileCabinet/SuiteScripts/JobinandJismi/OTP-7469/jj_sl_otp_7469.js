/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 *  @NModuleScope SameAccount
 */
/**********************************************************************************
 * OTP-7469 : Custom page for display sales order based on status
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
 * Date Created: 05-July-2024
 *
 * Description: This script is for creating a form and display details dynamically.
 *
 *
 * REVISION HISTORY
 *
 * @version 1.0 company name: 05-July-2024: Created the initial build by JJ0355
 *
 *
 *
 **************/
define(['N/log', 'N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (log, record, search, serverWidget) => {
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
                        title: 'Custom Page to display sales orders based on status'
                    });
                    form.clientScriptFileId = 26783;
                    form.addField({
                        id: 'customer_filter',
                        label: 'Customer',
                        type: serverWidget.FieldType.SELECT,
                        source: 'customer'
                    });
                    form.addField({
                        id: 'subsidiary_filter',
                        label: 'Subsidiary',
                        type: serverWidget.FieldType.SELECT,
                        source: 'subsidiary'
                    });
                    let sFilter = form.addField({
                        id: 'status_filter',
                        label: 'Status',
                        type: serverWidget.FieldType.SELECT
                    });
                    sFilter.addSelectOption({
                        value: '',
                        text: '--Select Status--'
                    });
                    sFilter.addSelectOption({
                        value: 'SalesOrd:B',
                        text: 'Pending Fulfillment'
                    });
                    sFilter.addSelectOption({
                        value: 'SalesOrd:D',
                        text: 'Partially Fulfilled'
                    });
                    sFilter.addSelectOption({
                        value: 'SalesOrd:E',
                        text: ' Pending Billing/Partially Fulfilled'
                    });
                    sFilter.addSelectOption({
                        value: 'SalesOrd:F',
                        text: ' Pending Billing'
                    });
                    form.addField({
                        id: 'department_filter',
                        label: 'Department',
                        type: serverWidget.FieldType.SELECT,
                        source: 'department'
                    });
                    let sublist = form.addSublist({
                        id: 'details',
                        label: "Details",
                        type: serverWidget.SublistType.LIST
                    });
                    sublist.addField({
                        id: 'internalid',
                        label: 'Internal ID',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'docname',
                        label: 'Document Name',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'date',
                        label: 'Date',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'status',
                        label: 'Status',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'customer',
                        label: 'Customer Name',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'subsidiary',
                        label: 'Subsidiary',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'department',
                        label: 'Department',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'class',
                        label: 'Class',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'lineno',
                        label: 'Line Number',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'subtotal',
                        label: 'Subtotal',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'tax',
                        label: 'Tax',
                        type: serverWidget.FieldType.TEXT
                    });
                    sublist.addField({
                        id: 'total',
                        label: 'Total',
                        type: serverWidget.FieldType.TEXT
                    });
                    log.error("created the headings");
                    let customerFilter = scriptContext.request.parameters.customer;
                    log.error("customer:"+customerFilter);
                    let subsidiaryFilter = scriptContext.request.parameters.subsidiary;
                    log.error("subsidiary:"+subsidiaryFilter);
                    let statusFilter = scriptContext.request.parameters.status;
                    log.error("status:"+statusFilter);
                    let departmentFilter = scriptContext.request.parameters.department;
                    log.error("dept:"+departmentFilter);
                    let filters = [
                        ["taxline", "is", "F"],
                        "AND",
                        ["mainline", "is", "F"],
                        "AND",
                        ["status", "noneof", "SalesOrd:A", "SalesOrd:C", "SalesOrd:G", "SalesOrd:H"]
                    ];
                    if (statusFilter || customerFilter || subsidiaryFilter || departmentFilter) {

                        if (subsidiaryFilter) {
                            filters.push('AND', ['subsidiary', 'is', subsidiaryFilter]);
                        }
                        if (customerFilter) {
                            filters.push('AND', ['entity', 'is', customerFilter]);
                        }
                        if (statusFilter) {
                            filters[4] = ['status', 'is', statusFilter];
                            // filters.push('AND', ['status', 'is', status.value]);
                        }
                        if (departmentFilter) {
                            filters.push('AND', ['department', 'is', departmentFilter]);
                        }
                    }
                    log.error(filters);
                    let searchResult = search.create({
                        type: search.Type.SALES_ORDER,
                        filters: filters,
                        columns: ['internalid', 'datecreated', 'status', 'entity', 'subsidiary', 'department', 'line', 'class', 'amount', 'taxamount']
                    });
                    let i = 0;
                    searchResult.run().each(function (result) {
                        let internalid = result.getValue('internalid');
                        let date = result.getValue('datecreated');
                        let status = result.getValue('status');
                        let customer = result.getText('entity');
                        let sub = result.getText('subsidiary');
                        let dept = result.getText('department') || 'N/A';
                        let cls = result.getText('class') || 'N/A';
                        let lineno = result.getValue('line') || 0
                        let total = result.getValue('amount');
                        let tax = result.getValue('taxamount') || 0;
                        let subtotal = total - tax;
                        sublist.setSublistValue({
                            id: 'internalid',
                            line: i,
                            value: internalid
                        });
                        sublist.setSublistValue({
                            id: 'docname',
                            line: i,
                            value: 'Sales Order'
                        });
                        sublist.setSublistValue({
                            id: 'date',
                            line: i,
                            value: date
                        });
                        sublist.setSublistValue({
                            id: 'status',
                            line: i,
                            value: status
                        });
                        sublist.setSublistValue({
                            id: 'customer',
                            line: i,
                            value: customer
                        });
                        sublist.setSublistValue({
                            id: 'subsidiary',
                            line: i,
                            value: sub
                        });
                        sublist.setSublistValue({
                            id: 'department',
                            line: i,
                            value: dept
                        });
                        sublist.setSublistValue({
                            id: 'class',
                            line: i,
                            value: cls
                        });
                        sublist.setSublistValue({
                            id: 'lineno',
                            line: i,
                            value: lineno
                        });
                        sublist.setSublistValue({
                            id: 'subtotal',
                            line: i,
                            value: subtotal
                        });
                        sublist.setSublistValue({
                            id: 'tax',
                            line: i,
                            value: tax
                        });
                        sublist.setSublistValue({
                            id: 'total',
                            line: i,
                            value: total
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