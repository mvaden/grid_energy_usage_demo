import { useEffect, useState } from 'react';
import {
    Button_Submit,
    HeadingOne,
    Input_DateTime,
    Input_Select,
    List,
    Table
} from './Components';
import {
    dayNames,
    formatDates,
    findArrayMedian,
    loadTypes,
    tableHeadings
} from './utils/_helpers';
import './App.css'

function App() {
    const [averageUsage, setAverageUsage] = useState(0);
	const [endDate, setEndDate] = useState('2018-01-02T12:00');
    const [error, setError] = useState(undefined);
	const [filtered, setFiltered] = useState([]);
    const [message, setMessage] = useState('waiting...');
    const [medianUsage, setMedianUsage] = useState(0);
	const [startDate, setStartDate] = useState('2018-01-01T12:00');
	const [selectedDays, setSelectedDays] = useState([]);
    const [selectedLoadTypes, setSelectedLoadTypes] = useState([]);
	const [totalEntriesReturned, setTotalEntriesReturned] = useState(0);
	const [totalUsage, setTotalUsage] = useState(0);

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
			
        const medianUsage = filteredData.map(({ Usage_kWh }) => Usage_kWh).sort((a, b) => a - b);
        const findMedian = findArrayMedian(medianUsage);
        const totalUsed = filteredData.reduce((sum, row) => sum + row.Usage_kWh, 0);

		setAverageUsage(filteredData.length > 0 ? totalUsed / filteredData.length : 0);
		setFiltered(filteredData);
        setMedianUsage(findMedian);
        setTotalEntriesReturned(filteredData.length);
		setTotalUsage(totalUsed);
    };

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
            {
                filtered.length > 0 &&
                <>
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
                </>
            }
		</div>
  	)
};

export default App;