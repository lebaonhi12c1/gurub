
import moment from "moment/moment";
import get from 'lodash/get'

/**
 * Returns the first letter of the last name in the given full name.
 * 
 * @param {string} name - The full name.
 * @returns {string} - The first letter of the last name.
 */
export function getFirstLetter(name) {
    // Split the full name into an array of words
    const nameArray = name.split(' ');
    
    // Get the last word and extract its first letter
    const result = nameArray[nameArray.length - 1].charAt(0).toUpperCase();
    
    return result;
}


export const convertDateToTimestamp = (date) => {
    return moment(date).unix()
}

export const converTimestampToDate = (timestamp) => {
    const isValidate = moment.unix(timestamp).isValid()
    if(!isValidate){
        return '--/--/----'
    }
    const formattedDate = moment.unix(timestamp).format('DD/MM/YYYY')

    return formattedDate
}

export const converTimestampToDateHMS = (timestamp) => {
    const isValidate = moment.unix(timestamp).isValid()
    if(!isValidate){
        return '--/--/----'
    }
    const formattedDate =moment(timestamp * 1000).format('DD/MM/YYYY HH:mm')

    return formattedDate
}


export const convertToLowerCase = (str) => {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '')
      .toLowerCase();         
  };



export const convertNumber = (number) => {
    return Number(number).toLocaleString('en-US')
}

export const convertCurrencyToNumber = (number = '0') => {
    return Number(number.replace(/,/g, ''));
}

export function convertStringToNumber(str) {
    let formattedNumber = str.replace(/\D/g, '');
    if(formattedNumber.length < 1){
        formattedNumber = 0
    }
    return Number(formattedNumber);
}
export  function checkEmpty(value) {
    if (value === undefined || value === null) {
        return true;
    }
    if (typeof value === 'string' && value.trim() === '') {
        return true;
    }
    if (Array.isArray(value) && value.length === 0) {
        return true;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
        return true;
    }
    return false;
}

export function getData(obj, path, defaultValue = '--') {
    if(checkEmpty(get(obj, path))) {
        return defaultValue;
    }
    return get(obj, path);
}


export function calculatePercentage(value1, value2) {
    if (isNaN(value1) || isNaN(value2)) {
        return {
            percentage: 0,
            changeType: 'same',
        };
    }


    const diff = value2 - value1;

    if(diff === 0) {
        return {
            percentage: 0,
            changeType: 'same',
        };
    }
    var percentage = (Math.abs(diff) / value1) * 100;
    let changeType = '';
    if (diff > 0) {
        changeType = 'up';
        percentage = '+' + percentage;
    } else if (diff < 0) {
        changeType = 'down';
        percentage = '-' + percentage;
    } else {
        changeType = 'same';
    }

    return { percentage, changeType };
}


export function changeLabelChart(timestamp, view) {
    if(view == 'day')
    {
        return moment(timestamp).format('DD/MM/YYYY')
    }
    if(view == 'week')
    {
        return 'Tuần ' + moment(timestamp).week()
    }
    if(view == 'month')
    {
        const monthString = moment(timestamp).format('MMMM'); // Lấy tên tháng
        return monthString.charAt(0).toUpperCase() + monthString.slice(1)
    }
    if(view == 'quarter')
    {
        return 'Quý ' + moment(timestamp).quarter()
    }
    if(view == 'year')
    {
        return 'Năm ' + moment(timestamp).year()
    }
    

    
}