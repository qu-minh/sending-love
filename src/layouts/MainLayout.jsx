import Header from '../components/Header/Header';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
            <Header />
            <main className="px-4 sm:px-6 lg:px-8">
                {children}
            </main>
            <footer className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-center text-white text-sm sm:text-base">
                        💕 Made with love for my beloved wife 💕
                    </p>
                    <p className="text-center text-pink-100 text-xs sm:text-sm mt-2">
                        © 2025 - Forever and Always
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
