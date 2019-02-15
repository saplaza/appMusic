//Enum variable for tab 
export var EN_TAB_PAGES = {
EN_TP_HOME: 0,
EN_TP_CATEGORY:1,
EN_TP_SEARCH: 2,
EN_TP_ACCOUNT: 3,

EN_TP_LENGHT: 4,
}
//A global variable 
export var Globals = {
//Nav ctrl of each tab page
navCtrls : new Array(EN_TAB_PAGES.EN_TP_LENGHT),
tabIndex:0, //Index of the current tab
tabs: <any>{}, //Hook to the tab object
}