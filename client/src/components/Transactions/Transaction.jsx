
import { iconFor } from "../../assets/icons/iconFor";
import { useMoney } from "../../money";

function Transaction({ item }) {
    const { format } = useMoney();

    return (
      <>
        <div className="container-2">
          <div className="main-block">
            {iconFor(item.iconName)}
          </div>
          <div className="main-text">
            <h3>{item.title}</h3>
          </div>
          <div className="main-price">
            <h3>{item.type === "Expense" ? "-" : "+"}{format(item.amount)}</h3>
            <p>{item.date}</p>

          </div>
        </div>
        <div className="main-long"></div>
      </>
    );
  }

  export default Transaction;


