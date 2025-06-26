


function Transaction({ item }) {
    return (
      <>
        <div className="container-2">
          <div className="main-block">
            <img src={item.image} alt="" />
          </div>
          <div className="main-text">
            <h3>{item.title}</h3>
          </div>
          <div className="main-price">
            <h3>${item.amount}</h3>
            <p>{item.date}</p>

          </div>
        </div>
        <div className="main-long"></div>
      </>
    );
  }
  
  export default Transaction;


