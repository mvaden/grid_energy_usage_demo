import { useEffect, useState } from 'react';
import './App.css'

function App() {
    const [message, setMessage] = useState('waiting...');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [filtered, setFiltered] = useState([]);
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
		setFiltered(filteredData);
        setTotalEntriesReturned(filteredData.length);
    };
  	
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

				<button onClick={handleFilter} style={{ marginLeft: '1rem' }}>Filter</button>
            </div>
            
			<div style={{ marginBottom: '1rem' }}>
				<strong>Total Usage (kWh):</strong> {totalUsage.toFixed(2)}
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
					</tr>
					</thead>
					<tbody>
						{
							filtered.map((row, index) => (
								<tr key={index}>
									<td>{row.date.toLocaleString()}</td>
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
