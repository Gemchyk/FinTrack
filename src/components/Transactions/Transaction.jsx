function Transaction({ image, alt, title, subtitle, price, date }) {
    return (
      <>
        <div className="container-2">
          <div className="main-block">
            <img src={image} alt={alt} />
          </div>
          <div className="main-text">
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
          <div className="main-price">
            <h3>{price}</h3>
            <p>{date}</p>
          </div>
        </div>
        <div className="main-long"></div>
      </>
    );
  }
  
  export default Transaction;