import { useEffect, useState } from 'react';
import './App.css'

function App() {
    const [message, setMessage] = useState('waiting...');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [filtered, setFiltered] = useState([]);
	const [totalUsage, setTotalUsage] = useState(0);
    const [averageUsage, setAverageUsage] = useState(0);
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
  	
	return (
		<div>
            <h1>Steel Industry Energy Usage</h1>
            <div style={{ marginBottom: '1rem' }}>
                
				<label>
				    Start Date:
                    <input 
                        type="datetime-local" 
                        value={startDate}
                        max="01-01-2019"
                        min="01-01-2018"
                        onChange={e => setStartDate(e.target.value)} 
                    />
                </label>
				<br />
				<label style={{ marginLeft: '1rem' }}>
                    End Date:
                    <input 
                        type="datetime-local" 
                        value={endDate} 
                        max="2019-01-01T00:00"
                        min="2018-01-01T00:00"
                        onChange={e => setEndDate(e.target.value)} 
                    />
                </label>

                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        Day of Week:
                        <select
                            multiple
                            value={selectedDays}
                            onChange={e => {
                                setSelectedDays(Array.from(e.target.selectedOptions, o => o.value));
                            }
                        }>
                            {
                                dayNames.map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                ))
                            }
                        </select>
                    </label>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        Load Type:
                        <select
                            multiple
                            value={selectedLoadTypes}
                            onChange={e => {
                                setSelectedLoadTypes(Array.from(e.target.selectedOptions, o => o.value));
                            }
                        }>
                            {
                                loadTypes.map((load) => (
                                    <option key={load} value={load}>{load}</option>
                                ))
                            }
                        </select>
                    </label>
                </div>
				<button onClick={handleFilter} style={{ marginLeft: '1rem' }}>Filter</button>
            </div>
            
			<div style={{ marginBottom: '1rem' }}>
				<strong>Total Usage (kWh):</strong> {totalUsage.toFixed(2)}
				<br/>
				<strong>Average Usage (kWh):</strong> {averageUsage.toFixed(2)}
            </div>
            
            <div
                style={{
				width: 'auto',
				height: '25rem',
				overflowY: 'scroll'
			}}>
                <table
                    border="1"
                    cellPadding="5"
                    style={{
                        marginTop: '1rem',
                        width: '100%'
                    }}
                >
					<thead>
					<tr>
						<th>Date</th>
						<th>Usage (kWh)</th>
						<th>Day of Week</th>
						<th>Type of Load</th>
					</tr>
					</thead>
					<tbody>
						{
							filtered.map((row, index) => (
								<tr key={index}>
									<td>{row.date.toLocaleString()}</td>
									<td>{row.Usage_kWh.toFixed(2)}</td>
									<td>{row.Day_of_week}</td>
									<td>{row.Load_Type}</td>
								</tr>
							))
						}
					</tbody>
				</table>
            </div>
		</div>
  	)
};

export default App;
