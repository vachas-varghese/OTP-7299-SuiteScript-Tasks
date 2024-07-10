/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
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
 * Description: This script is used for dynamically changing the filters of the search in suitelet script.
 *
 *
 * REVISION HISTORY
 *
 * @version 1.0 company name: 05-July-2024: Created the initial build by JJ0355
 *
 *
 *
 **************/
define(['N/currency', 'N/currentRecord', 'N/log', 'N/record', 'N/url'],
/**
 * @param{currency} currency
 * @param{currentRecord} currentRecord
 * @param{log} log
 * @param{record} record
 * @param{url} url
 */
function(currency, currentRecord, log, record, url) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {

    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
        let currentSalesRecord = scriptContext.currentRecord;
        let statusFilter = currentSalesRecord.getValue('status_filter');
        let customerFilter = currentSalesRecord.getValue('customer_filter');
        let subsidiaryFilter = currentSalesRecord.getValue('subsidiary_filter');
        let departmentFilter = currentSalesRecord.getValue('department_filter');
        console.log("entered client script");
        console.log(statusFilter);
        console.log(customerFilter);
        console.log(subsidiaryFilter);
        console.log(departmentFilter);
        // Passing Parameter to the Suitelet
        if (scriptContext.fieldId == 'status_filter' || scriptContext.fieldId == 'customer_filter' || scriptContext.fieldId == 'subsidiary_filter' || scriptContext.fieldId == 'department_filter') {
            try {
                document.location = url.resolveScript({
                    scriptId: 'customscript_jj_sl_otp7469',
                    deploymentId: 'customdeploy_jj_sl_otp7469',
                    params: {
                        'customer': customerFilter,
                        'subsidiary': subsidiaryFilter,
                        'status': statusFilter,
                        'department': departmentFilter
                    }
                });
               // console.log('Suitelet URL', suiteletUrl);
                // if (statusFilter || customerFilter || subsidiaryFilter || departmentFilter) {
                // window.location.href = suiteletUrl;
                // }
            } catch (error) {
                console.log(error);
            }


        }
         
    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {

    }

    return {
        // pageInit: pageInit,
        fieldChanged: fieldChanged
        // postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
        // saveRecord: saveRecord
    };
    
});
