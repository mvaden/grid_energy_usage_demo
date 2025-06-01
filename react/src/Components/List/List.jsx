const List = ({ listData }) => {
    console.log('list data', listData.map((row) =>{ return ( row )}))
    return (
        <ul style={{ listStyleType: 'none' }}>
            {
                listData.map((row) => {          
                    return (

                        <li>
                            { row.listItemContent }
                            { row.calculcation }
                        </li>
                    )
                })
            }
        </ul>
    );
};

export default List;