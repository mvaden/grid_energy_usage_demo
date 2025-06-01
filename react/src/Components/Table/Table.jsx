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
    console.log("Table data: ", tableData)
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
                            tableHeadings.map((row, index) => (                 
                                <th key={index}>{ row }</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.date.toLocaleString()}</td>
                                <td>{row.Usage_kWh}</td>
                                <td>{row.Day_of_week}</td>
                                <td>{row.Load_Type}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default Table;