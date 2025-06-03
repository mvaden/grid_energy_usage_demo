import { useEffect, useState } from 'react';
import {
    Button_Submit,
    HeadingOne,
    HeadingTwo,
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
                if (!res.ok) throw new Error('HTTP Error: status ', res.status);
                
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

		const filteredData = message.filter(({ date, Day_of_week, Load_Type }) => {
            const dateRange = ( !start || date >= start ) && ( !end || date <= end );

            const matchedDay = selectedDays.length === 0 || selectedDays.includes( Day_of_week );
            const matchedLoadType = selectedLoadTypes.length === 0 || selectedLoadTypes.includes( Load_Type );
            
			return dateRange && matchedDay && matchedLoadType;
		});
			
        const medianUsage = filteredData.map(({ Usage_kWh }) => Usage_kWh).sort((a, b) => a - b);
        const findMedian = findArrayMedian(medianUsage);
        const totalUsed = filteredData.reduce((sum, { Usage_kWh }) => sum + Usage_kWh, 0);

		setAverageUsage(filteredData.length > 0 ? totalUsed / filteredData.length : 0);
		setFiltered(filteredData);
        setMedianUsage(findMedian);
        setTotalEntriesReturned(filteredData.length);
		setTotalUsage(totalUsed);
    };

    const listData = [
        {
            calculcation: totalUsage.toFixed(2),
            listItemContent: 'Total Usage (kWh): '
        },
        {
            calculcation: averageUsage.toFixed(2),
            listItemContent: 'Average Usage (kWh): '
        },
        {
            calculcation: medianUsage,
            listItemContent: 'Median Usage (kWh): '
        },
        {
            calculcation: totalEntriesReturned,
            listItemContent: 'Total Entries Returned: '
        },
    ];
  	
	return (
		<div>
            <HeadingOne value={ 'Steel Industry Energy Usage' } />
            <div style={{ marginBottom: '1rem' }}>
                <HeadingTwo value={ 'Energy Records Form' } />
                <Input_DateTime
                    label={ 'Start Date: ' }
                    onChange={e =>  setStartDate(e.target.value)}
                    value={startDate}
                />
                <Input_DateTime
                    label={ 'End Date: ' }
                    onChange={e => { setEndDate(e.target.value) }}
                    value={endDate}
                />
                <Input_Select
                    label={ 'Day of Week:' }
                    multiple={true}
                    options={dayNames}
                    onChange={e => {
                        setSelectedDays( Array.from(e.target.selectedOptions, ({ value }) => value) );
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
                        <HeadingTwo value={ 'Totals and Means' } />
                        <List listData={listData} />
                    </div>
                    <div
                        style={{
                            height: '25rem',
                            overflowY: 'scroll',
                            width: 'auto'
                        }}
                    >
                        <HeadingTwo value={ 'Energy Usage Table Data' } />
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