const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
    const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-colors duration-200';

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
