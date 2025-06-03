const Table = (
    {
        cellBorder,
        cellPadding,
        tableHeight,
        tableHeadings,
        tableData,
        tableWidth, 
        overflowY
    }
) => {
    return (
        <div
            style={{
                height: tableHeight,
                width: tableWidth,
                overflowY
            }}
        >
            <table
                border={cellBorder}
                cellPadding={cellPadding}
                style={{
                    marginTop: '1rem',
                    width: '100%'
                }}
            >
                <thead>
                    <tr>
                        {
                            tableHeadings.map(( row, index ) => {(                 
                                <th key={index}>{ row }</th>
                            )})
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData.map((
                            {
                                date,
                                Day_of_week,
                                Load_Type,
                                Usage_kWh
                            },
                            index
                        ) => (
                            <tr key={ index }>
                                <td>{ date.toLocaleString() }</td>
                                <td>{ Usage_kWh }</td>
                                <td>{ Day_of_week }</td>
                                <td>{ Load_Type }</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default Table;