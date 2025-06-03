const Input_Select = (
    {
        label,
        multiple,
        onChange,
        options,
        value
    }
) => {
    return (
        <div>
            <label>
                { label } 
                <select
                    multiple={ multiple }
                    value={ value }
                    onChange={ onChange }
                >
                    {
                        options.map(( day ) => (
                            <option key={ day } value={ day }>{ day }</option>
                        ))
                    }
                </select>
            </label>
        </div>
    )
};

export default Input_Select;