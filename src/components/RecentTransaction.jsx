import "./RecentTransaction.css";

function RecentTransaction() {
    return (
        <div className="container">
            <header>
            <nav className="navigation">
                <a href="#"><span className="span">All</span></a>
                <a href="#">Revenue</a>
                <a href="#">Expenses</a>
            </nav>
            </header>
            <main>
                <div className="container-2">
                    <div className="main-block">
                        <img src="/images/gamepage.svg" alt="Joystick" />
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
                <div className="main-long"></div>
                <div className="container-2">
                    <div className="main-block">
                        <img src="/images/bag.svg" alt="Bag" />
                    </div>
                    <div className="main-text">
                        <h3>Polo Shirt</h3>
                        <p>XL fashions</p>
                    </div>
                    <div className="main-price">
                        <h3>$20.00</h3>
                        <p>17 May 2023</p>
                    </div>
                </div>
                <div className="main-long"></div>
                <div className="container-2">
                    <div className="main-block">
                        <img src="/images/house.svg" alt="House" />
                    </div>
                    <div className="main-text">
                        <h3>Biriyani</h3>
                        <p>Hajir Biriyani</p>
                    </div>
                    <div className="main-price">
                        <h3>$10.00</h3>
                        <p>17 May 2023</p>
                    </div>
                </div>
                <div className="main-long"></div>
                <div className="container-2">
                    <div className="main-block">
                        <img src="/images/taxi.svg" alt="Taxi" />
                    </div>
                    <div className="main-text">
                        <h3>Taxi Fare</h3>
                        <p>Uber</p>
                    </div>
                    <div className="main-price">
                        <h3>$12.00</h3>
                        <p>17 May 2023</p>
                    </div>
                </div>
                <div className="main-long"></div>
                <div className="container-2">
                    <div className="main-block">
                        <img src="/images/bag2.svg" alt="Bag2" />
                    </div>
                    <div className="main-text">
                        <h3>Keyboard</h3>
                        <p>Gadget & Gear</p>
                    </div>
                    <div className="main-price">
                        <h3>$22.00</h3>
                        <p>17 May 2023</p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default RecentTransaction