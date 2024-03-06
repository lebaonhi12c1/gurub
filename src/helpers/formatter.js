import moment from "moment";
import _map from "lodash/map";

export function dateFormatter(value, type) {
    switch (type) {
        case "number":
            value = parseInt(value);
            if ([NaN, 0].includes(value)) {
                return "Hiện tại";
            }

            return moment.unix(value).format("DD/MM/YYYY");
        case "date":
            if (!moment(value)._isValid) {
                return null;
            }
            return moment(value).format("DD/MM/YYYY");
        case "array":
            return _map(value, (value_of_date) => {
                if (!moment(value_of_date)._isValid) {
                    return null;
                }

                return moment(value_of_date).format("DD/MM/YYYY");
            }).join(" - ");
        default:
            return null;
    }
}

export function numberFormatter(value) {
    let _value = parseFloat(value);
    let empty_value = [NaN, 0, null];
    if (empty_value.includes(_value)) {
        return "-";
    }

    _value = parseFloat(_value.toFixed(0)).toLocaleString("de-DE");
    return _value;
}
