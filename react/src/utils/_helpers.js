export const dayNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];
  
export const loadTypes = [
    'Light_Load',
    'Maximum_Load',
    'Medium_Load'
];

export const tableHeadings = [
    'Date',
    'Usage (kWh)',
    'Day of Week',
    'Type of Load'
];

export const findArrayMedian = (values) => {
    if (!Array.isArray(values) || values.length === 0) return null;

    const sortValues = [...values].sort((a, b) => a - b);
    const valuesLength = sortValues.length;
    const calculateMedian = Math.floor(valuesLength / 2);

    if (valuesLength % 2 === 1) return sortValues[calculateMedian];

    if (valuesLength % 2 === 0) {
        const mid = valuesLength / 2
        const firstHalf = sortValues.slice(0, mid);
        const secondHalf = sortValues.slice(mid);
        const calculatedMedianValue = Math.floor(((firstHalf[0] + secondHalf[secondHalf.length - 1]) / 2) * 1000) / 1000;

        return calculatedMedianValue;
    };
};

export const formatDates = (array, dateKey) => {
    return array.map((item) => {
        const original = item[dateKey];
        const [datePart, timePart] = original.split(' ');
        const [day, month, year] = datePart.split('/'); 
        const isoString = `${year}-${month}-${day}T${timePart}`;

        return {
            ...item,
            [dateKey]: new Date(isoString),
        };
    });
};