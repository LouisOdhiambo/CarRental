import "./App.css";
import { useState } from "react";
import Axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone] = useState("");
  const [rental_date, setRentalDate] = useState("");
  const [return_date, setReturnDate] = useState("");
  const [newPhone, setNewPhone] = useState(0);
  const [customerList, setCustomerList] = useState([]);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(0);
  const [rental_rate_per_day, setRentalRates] = useState(0);
  const [newYear, setNewYear] = useState(0);
  const [carList, setCarList] = useState([]);


  const [currentPage, setCurrentPage] = useState("customers");

  // Function to render the content of the current page
  const renderPageContent = () => {
    switch (currentPage) {
      case "cars":
        return (
          <div className="App">
            <div className="information">
              <div>
                <label>Make:</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setMake(event.target.value);
                  }}
                />
                <label>Model:</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setModel(event.target.value);
                  }}
                />
                <label>year:</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setYear(event.target.value);
                  }}
                />
                <label>Rate:</label>
                <input
                  type="number"
                  onChange={(event) => {
                    setRentalRates(event.target.value);
                  }}
                />
              </div>
              <div className="addShow">
                <button onClick={addCar}>Add Car</button>
                <button onClick={getCars}>Show Cars</button>
              </div>
            </div>

            <div className="employees">
              <table>
                <thead>
                  <tr>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Rental Rate</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {carList.map((val, key) => (
                    <tr key={key}>
                      <td>{val.make}</td>
                      <td>{val.model}</td>
                      <td>{val.year}</td>
                      <td>{val.rental_rate_per_day}</td>
                      <td>
                        <input
                          type="text"
                          placeholder="New Year..."
                          onChange={(event) => {
                            setNewYear(event.target.value);
                          }}
                        />
                        <button className="tableButton" onClick={() => updateCarYear(val.car_id)}>Update</button>
                        <button className="tableButton" onClick={() => deleteCar(val.car_id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        );
        
      default:
        return (
          <div className="App">
            <div className="information">
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
                <label>Email:</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
                <label>Phone Number:</label>
                <input
                  type="text"
                  onChange={(event) => {
                    setPhone(event.target.value);
                  }}
                />
                <label>Rental Date:</label>
                <input
                  type="date"
                  onChange={(event) => {
                    setRentalDate(event.target.value);
                  }}
                />
                <label>Return Date:</label>
                <input
                  type="date"
                  onChange={(event) => {
                    setReturnDate(event.target.value);
                  }}
                />
              </div>
              <div className="addShow">
                <button onClick={addCustomer}>Add Customer</button>
                <button onClick={getCustomers}>Show Customers</button>
              </div>
            </div>

            <div className="employees">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Rental Date</th>
                    <th>Return Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customerList.map((val, key) => (
                    <tr key={key}>
                      <td>{val.name}</td>
                      <td>{val.email}</td>
                      <td>{val.phone_number}</td>
                      <td>{val.rental_date}</td>
                      <td>{val.return_date}</td>
                      <td>
                        <input
                          type="text"
                          placeholder="New Phone..."
                          onChange={(event) => {
                            setNewPhone(event.target.value);
                          }}
                        />
                        <button className="tableButton" onClick={() => updateCustomerPhone(val.customer_id)}>Update</button>
                        <button className="tableButton" onClick={() => deleteCustomer(val.customer_id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        );
    }
  };

  // Customer
  const addCustomer = () => {
    Axios.post("http://localhost:3001/create", {
      name: name,
      email: email,
      phone_number: phone_number,
      rental_date: rental_date,
      return_date: return_date,
    }).then(() => {
      setCustomerList([
        ...customerList,
        {
          name: name,
          email: email,
          phone_number: phone_number,
          rental_date: rental_date,
          return_date: return_date,
        },
      ]);
    });
  };

  const getCustomers = () => {
    Axios.get("http://localhost:3001/customers").then((response) => {
      setCustomerList(response.data);
    });
  };

  const updateCustomerPhone = (customer_id) => {
    Axios.put("http://localhost:3001/update", { phone_number: newPhone, customer_id: customer_id }).then(
      (response) => {
        // Find the index of the customer with the given customer_id in the customerList state
        const customerIndex = customerList.findIndex((val) => val.customer_id === customer_id);
        if (customerIndex !== -1) {
          // Create a new copy of the customerList state array
          const updatedCustomerList = [...customerList];
          // Update the phone number for the specific customer
          updatedCustomerList[customerIndex] = {
            ...updatedCustomerList[customerIndex],
            phone_number: newPhone,
          };
          // Set the updated customerList state
          setCustomerList(updatedCustomerList);
        }
      }
    );
  };

  const deleteCustomer = (customer_id) => {
    Axios.delete(`http://localhost:3001/delete/${customer_id}`).then((response) => {
      setCustomerList(
        customerList.filter((val) => {
          return val.customer_id !== customer_id;
        })
      );
    });
  };

  // Cars
  const addCar = () => {
    Axios.post("http://localhost:3001/createcar", {
      make: make,
      model: model,
      year: year,
      rental_rate_per_day: rental_rate_per_day,
    }).then(() => {
      setCarList([
        ...carList,
        {
          make: make,
          model: model,
          year: year,
          rental_rate_per_day: rental_rate_per_day,
        },
      ]);
    });
  };

  const getCars = () => {
    Axios.get("http://localhost:3001/cars").then((response) => {
      setCarList(response.data);
    });
  };

  const updateCarYear = (car_id) => {
    Axios.put("http://localhost:3001/updatecar", { year: newYear, car_id: car_id }).then(
      (response) => {
        // Find the index of the car with the given id in the carList state
        const carIndex = carList.findIndex((val) => val.car_id === car_id);
        if (carIndex !== -1) {
          // Create a new copy of the customerList state array
          const updatedCarList = [...carList];
          // Update the phone number for the specific customer
          updatedCarList[carIndex] = {
            ...updatedCarList[carIndex],
            year: newYear,
          };
          // Set the updated customerList state
          setCarList(updatedCarList);
        }
      }
    );
  };

  const deleteCar = (car_id) => {
    Axios.delete(`http://localhost:3001/delete/${car_id}`).then((response) => {
      setCarList(
        carList.filter((val) => {
          return val.car_id !== car_id;
        })
      );
    });
  };

  // Rates
  // const fetchRentalRates = () => {
  //   Axios.get("http://localhost:3001/rentalRates").then((response) => {
  //     setRentalRates(response.data);
  //   });
  // };


  return (
    <div className="Content">
      {/* Navigation bar */}
      <nav>
        <ul>
          <li>
            <h4 onClick={() => setCurrentPage("customers")}>Customers</h4>
          </li>
          <li>
            <h4 onClick={() => setCurrentPage("cars")}>Cars</h4>
          </li>
        </ul>
      </nav>

      {/* Render the content of the current page */}
      {renderPageContent()}
    </div>
  );
}

export default App;
