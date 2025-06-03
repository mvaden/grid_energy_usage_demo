const Input_DateTime = (
    {
        label,
        onChange,
        value
    }
) => {
    return (
        <div>
            <label>
                { label }
                <input
                    max="2019-01-01T00:00"
                    min="2018-01-01T00:00"
                    onChange={ onChange }
                    type="datetime-local"
                    value={ value }
                />
            </label>      
        </div>
    );
};

export default Input_DateTime;