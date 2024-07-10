/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
/**********************************************************************************
 * OTP-7416 : Restrict IF save
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
 * Date Created: 02-July-2024
 *
 * Description: This script is for restricting the save of Item fulfillment record if there is a customer deposit attached to the sales order and the amount is less than the sales order total.
 *
 *
 * REVISION HISTORY
 *
 * @version 1.0 company name: 02-July-2024: Created the initial build by JJ0355
 *
 *
 *
 **************/
define(['N/log', 'N/record', 'N/search', 'N/ui/dialog'],
/**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 * @param{dialog} dialog
 */
function(log, record, search, dialog) {
    
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
        let currentrec=scriptContext.currentRecord;
        let fieldid=currentrec.fieldId;
        let salesOrderId=currentrec.getValue({
            fieldId: 'createdfrom'
        }); //getting internal id of the sales order
        let salesOrder=record.load({
            type: record.Type.SALES_ORDER,
            id: salesOrderId,
            isDynamic: true
        }); //loading the sales order
        log.error(salesOrderId);
        let amount=salesOrder.getValue('total');
        let searchresult=search.create({
            type: search.Type.CUSTOMER_DEPOSIT,
            columns: ['internalid','salesorder','amount'],
            filters:['salesorder','anyof',salesOrderId]
        }); //creating a search on customer deposit record
        let deposit=0;
        searchresult.run().each(function(result){
            deposit+=parseInt(result.getValue('amount')); //calculating the total deposit amount of the sales order
            return true;
        });
        log.error("deposit:"+deposit);
        log.error("total:"+amount);
        if (deposit < amount && deposit>0) {
            dialog.alert({
                title: "Warning",
                message: "The customer deposit is less than the sales order amount."
            });
            return false;

        } //restricting the save and displaying an dialog message if there is a customer deposit for the sales order but it is less than the sales order amount
        else {
            return true;
        }
    }

    return {
        // pageInit: pageInit,
        // fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
        saveRecord: saveRecord
    };
    
});
