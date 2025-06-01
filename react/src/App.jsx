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
                setMessage(convertDates(Message, 'date'));
            })
            .catch(({ Error }) => {
                console.error(Error);
                setError();
		});
  	}, []);

    console.log("Message: ", message)
  	
	return (
		<>
			hello react
		</>
  	)
};

export default App;
