const List = ({ listData }) => {
    return (
        <ul style={{ listStyleType: 'none' }}>
            {
                listData.map((
                    {
                        calculcation,
                        listItemContent
                    },
                    index
                ) => {          
                    return (

                        <li key={ index }>
                            { listItemContent }
                            { calculcation }
                        </li>
                    )
                })
            }
        </ul>
    );
};

export default List;