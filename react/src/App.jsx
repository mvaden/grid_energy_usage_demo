import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [message, setMessage] = useState('waiting...');

	useEffect(() => {
    fetch('/api/data')
    	.then(res => {
			// console.log("Res status: ", res.status),
			// console.log("Res headers: ", res.headers)

			if (!res.ok) throw new Error ("HTTP Error: status ", res.status)

			const contentType = res.headers.get('content-type');
			if (!contentType || !contentType.includes('application/json')) {
				throw new Error('Response is not JSON');
			};
			return res.json()
		})
      	.then(data => {
			setMessage(data)
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
