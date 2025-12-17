const Header = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                            <span className="text-2xl sm:text-3xl">💖</span>
                            <span className="hidden sm:inline">Gửi Em Yêu Dấu</span>
                            <span className="sm:hidden">Yêu Em</span>
                        </h1>
                    </div>
                    <nav className="flex space-x-2 sm:space-x-6">
                        <button
                            onClick={() => scrollToSection('home')}
                            className="text-white hover:text-pink-100 transition-colors text-sm sm:text-base font-medium"
                        >
                            Trang Chủ
                        </button>
                        <button
                            onClick={() => scrollToSection('messages')}
                            className="text-white hover:text-pink-100 transition-colors text-sm sm:text-base font-medium"
                        >
                            Lời Nhắn
                        </button>
                        <button
                            onClick={() => scrollToSection('memories')}
                            className="text-white hover:text-pink-100 transition-colors text-sm sm:text-base font-medium"
                        >
                            Kỷ Niệm
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
