import { useEffect, useState } from 'react';
import './App.css'

function App() {
    const [message, setMessage] = useState('waiting...');
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
            </div>
		</div>
  	)
};

export default App;
