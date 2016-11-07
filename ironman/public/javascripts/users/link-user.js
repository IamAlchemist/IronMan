/**
 * Created by wizard on 11/7/16.
 */

var linkUserFormElem;
var addButtonElem;

require(['../libs/ironmanLib'],function (ironmanLib) {
    linkUserFormElem = $('form#link-user-form');
    addButtonElem = $('button#addButton');

    ironmanLib.setupForm(linkUserFormElem, ()=>{
        location.reload();
    });
});

function addNewLink() {
    linkUserFormElem.removeClass('hidden');
    addButtonElem.addClass('hidden');
}