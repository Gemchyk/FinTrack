import './RecentTransaction.css';

function RecentTransaction() {
    return (
        <div>
            <header>
            <nav className="navigation">
                <a href="#"><span className="span">All</span></a>
                <a href="#">Revenue</a>
                <a href="#">Expenses</a>
            </nav>
            </header>
            <main>
                <div className="conatiner">
                    <div className="main-block">
                        <img src="img/joystick.svg" alt="Joystick" />
                    </div>
                    <div className="main-text">
                        <h3>GTR 5</h3>
                        <p>Gadget & Gear</p>
                    </div>
                    <div className="main-price">
                        <h3>$160.00</h3>
                        <p>17 May 2023</p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default RecentTransaction