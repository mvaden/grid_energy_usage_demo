import { useEffect, useState } from 'react';
import {
    Button_Submit,
    HeadingOne,
    Input_DateTime,
    Input_Select,
    List,
    Table
} from './Components';
import './App.css'

function App() {
    const [message, setMessage] = useState('waiting...');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [filtered, setFiltered] = useState([]);
	const [totalUsage, setTotalUsage] = useState(0);
    const [averageUsage, setAverageUsage] = useState(0);
    const [medianUsage, setMedianUsage] = useState(0);
	const [totalEntriesReturned, setTotalEntriesReturned] = useState(0);
	const [selectedDays, setSelectedDays] = useState([]);
    const [selectedLoadTypes, setSelectedLoadTypes] = useState([]);
    const [error, setError] = useState(undefined);

	useEffect(() => {
        fetch('/api/all-data')
    	.then(res => {
                if (!res.ok) throw new Error("HTTP Error: status ", res.status);

			const contentType = res.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) throw new Error('Response is not JSON');
                
                return res.json();
		})
            .then(({ Message }) => {
                setMessage(formatDates(Message, 'date'));
            })
            .catch(({ Error }) => {
                console.error(Error);
                setError();
		});
  	}, []);

    const findArrayMedian = (values) => {
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
    
	function formatDates(array, dateKey) {
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

	const handleFilter = () => {
		if (!startDate || !endDate) return;

		const start = startDate ? new Date(startDate) : null;
		const end = endDate ? new Date(endDate) : null;

		const filteredData = message.filter((row) => {
            const dateRange = (!start || row.date >= start) && (!end || row.date <= end);

            const matchedDay = selectedDays.length === 0 || selectedDays.includes(row.Day_of_week);
            const matchedLoadType = selectedLoadTypes.length === 0 || selectedLoadTypes.includes(row.Load_Type);
            
			return dateRange && matchedDay && matchedLoadType;
		});
			
        const totalUsed = filteredData.reduce((sum, row) => sum + row.Usage_kWh, 0);
        const medianUsage = filteredData.map(({ Usage_kWh }) => Usage_kWh).sort((a, b) => a - b);
        const findMedian = findArrayMedian(medianUsage);

        setMedianUsage(findMedian);
		setFiltered(filteredData);
		setTotalUsage(totalUsed);
		setAverageUsage(filteredData.length > 0 ? totalUsed / filteredData.length : 0);
        setTotalEntriesReturned(filteredData.length);
    };

    const loadTypes = [
        'Light_Load',
        'Maximum_Load',
        'Medium_Load'
    ];

    const dayNames = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    const listData = [
        {
            listItemContent: 'Total Usage (kWh): ',
            calculcation: totalUsage.toFixed(2)
        },
        {
            listItemContent: 'Average Usage (kWh): ',
            calculcation: averageUsage.toFixed(2)
        },
        {
            listItemContent: 'Median Usage (kWh): ',
            calculcation: medianUsage
        },
        {
            listItemContent: 'Total Entries Returned: ',
            calculcation: totalEntriesReturned
        },
    ];
  	
	return (
		<div>
            <HeadingOne value={ 'Steel Industry Energy Usage' } />
            <div style={{ marginBottom: '1rem' }}>
                <Input_DateTime
                    label={ 'Start Date: ' }
                    onChange={e =>  setStartDate(e.target.value)}
                    value={startDate}
                />
                <Input_DateTime
                    label={ 'End Date: ' }
                    onChange={e => { setEndDate(e.target.value), console.log(e.target.value) }}
                    value={endDate}
                />
                <Input_Select
                    label={ 'Day of Week:' }
                    multiple={true}
                    options={dayNames}
                    onChange={e => {
                        setSelectedDays(Array.from(e.target.selectedOptions, o => o.value));
                    }}
                    value={selectedDays}
                />
                <Input_Select
                    label={ 'Load Type: ' }
                    multiple={true}
                    options={loadTypes}
                    onChange={e => {
                        setSelectedLoadTypes(Array.from(e.target.selectedOptions, o => o.value));
                    }}
                    value={selectedLoadTypes}
                />
                <Button_Submit label={'Get Records'} onClick={handleFilter} />
            </div>
            <div>
                <List listData={listData} />
            </div>
            <div
                style={{
                    height: '25rem',
                    overflowY: 'scroll',
                    width: 'auto'
                }}
            >
                <Table
                    cellBorder={'5'}
                    cellPadding={'5'}
                    overflowY={'scroll'}
                    tableData={filtered}
                    tableHeadings={tableHeadings}
                    tableWidth={'auto'}
                    />    
			</div>
		</div>
  	)
};

export default App;
