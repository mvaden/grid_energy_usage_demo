const Button_Submit = ({ label, onClick }) => {
    return (
        <button
            onClick={ onClick }
            style={{ border: '1px solid #000' }}
        >
            { label }
        </button>
    );
};

export default Button_Submit;