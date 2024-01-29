import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'bootstrap';
const Problem2 = () => {
    const modalRefA = useRef();
    const modalRefB = useRef();
    const modalRefC = useRef();
    let currentModal = null;
    const [allContacts, setAllContacts] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [evenData, setEvenhData] = useState([]);
    const [modalBData, setModalBData] = useState([]);
    const [modalCData, setModalCData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingB, setLoadingB] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [moreData,setMoreData] = useState(true);
    const [onlyEven, setOnlyEven] = useState(false);
    const [onlySearch, setOnlySearch] = useState(false);

    const showModalA = async () => {
        if (currentModal) {
            const bsModal = Modal.getInstance(currentModal);
            bsModal.hide();
        }

        const modalEle = modalRefA.current;
        const bsModal = new Modal(modalEle, {
            backdrop: 'static',
            keyboard: false
        });

        if (loading) {
            try {
                const response = await fetch('https://contact.mediusware.com/api/contacts/');
                const data = await response.json();
                setAllContacts(data.results);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        bsModal.show();
        currentModal = modalEle;
    };

    const hideModalA = () => {
        const modalEle = modalRefA.current;
        const bsModal = Modal.getInstance(modalEle);
        bsModal.hide();
    };
    // for modal A scrolling
    const handleScrollInfinity = () => {
        const modalBody = modalRefA.current.querySelector('.modal-body');
        if (modalBody.scrollTop + modalBody.clientHeight >= modalBody.scrollHeight - 20) {
            if (moreData) {
                loadingNextPage();
            }
        }
    }
    const loadingNextPage = async () => {
        try {
            const nextPage = currentPage + 1;
            const response = await fetch(`https://contact.mediusware.com/api/contacts/?page=${nextPage}`);
            const data = await response.json();
            if (data.results.length > 0) {
              setAllContacts((prevContacts) => [...prevContacts, ...data.results]);
              setCurrentPage(nextPage);
            } else {
              // No more pages
              setMoreData(false);
            }
          } catch (error) {
            console.error('Error fetching', error);
          }
    }
    useEffect(() => {
        const modalBody = modalRefA.current.querySelector('.modal-body');
        modalBody.addEventListener('scroll', handleScrollInfinity);
        return () => {
          modalBody.removeEventListener('scroll', handleScrollInfinity);
        };
      }, [allContacts, moreData]);
    
    const showModalB = async () => {
        if (currentModal) {
            const bsModal = Modal.getInstance(currentModal);
            bsModal.hide();
        }

        const modalEle = modalRefB.current;
        const bsModal = new Modal(modalEle, {
            backdrop: 'static',
            keyboard: false
        });
        if (loadingB) {
            try {
                const selectedCountry = 'United%20States';
                const response = await fetch(`https://contact.mediusware.com/api/country-contacts/${selectedCountry}/`);
                const data = await response.json();
                setModalBData(data.results);
                setLoadingB(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        bsModal.show();
        currentModal = modalEle;
    };

    const hideModalB = () => {
        const modalEle = modalRefB.current;
        const bsModal = Modal.getInstance(modalEle);
        bsModal.hide();
    };

    const handleSearch = (e) => {
            const searchValue = e.target.value.toLowerCase();
            const filteredContacts = allContacts.filter(contact =>
              contact.phone.toLowerCase().includes(searchValue)
            );
            setSearchData(filteredContacts);
            setOnlySearch(true);
            if (searchValue == '') {
                setOnlySearch(false);
                setAllContacts(allContacts);
            }
      };


const handleCheckboxChange = (e) => {
    setOnlyEven(e.target.checked);
    filterContacts(e.target.checked);
};

const filterContacts = (isOnlyEven) => {
    if (isOnlyEven) {
        setEvenhData(
            allContacts
                .filter((contact) => (!isOnlyEven || (isOnlyEven && contact.id % 2 === 0)))
        );
    }else{
        setAllContacts(allContacts);
    }
};

const showModalC = async (id) => {
    if (currentModal) {
        const bsModal = Modal.getInstance(currentModal);
        bsModal.hide();
    }

    const modalEle = modalRefC.current;
    const bsModal = new Modal(modalEle, {
        backdrop: 'static',
        keyboard: false
    });
    const filteredResults = allContacts.filter(contact => contact.id == id);
    console.log(filteredResults);
    setModalCData(filteredResults);


    bsModal.show();
    currentModal = modalEle;
};

const hideModalC = () => {
    const modalEle = modalRefC.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
};


    return (

        <div className="container">
            <div className="row justify-content-center mt-5">
                <h4 className='text-center text-uppercase mb-5'>Problem-2</h4>

                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-lg btn-outline-primary" type="button" onClick={showModalA}>All Contacts</button>
                    <button className="btn btn-lg btn-outline-warning" type="button" onClick={showModalB}>US Contacts</button>
                </div>
                <div className="modal fade" ref={modalRefA} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Modal A</h5>
                                <button type="button" className="btn-close" onClick={hideModalA} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                            <input type="text" className="form-control" onKeyUp={handleSearch} placeholder="Search Here" aria-label="Search" /><br></br>
                            {loading ? (
                                <div className="spinner-border text-info" role="status">
                                     <span className="visually-hidden">Loading...</span>
                                </div>
                        ) : (
                            <table className="table">
                            <thead>
                                <tr>
                                <th>ID</th>
                                <th>Country Name</th>
                                <th>Phone No</th>
                                </tr>
                            </thead>
                            <tbody>
                                { onlySearch == true ? searchData.map((contact,index) => (
                                <tr key={index}  onClick={() =>{showModalC(contact.id);  hideModalA(); hideModalB();}}>
                                    <td>{contact.id}</td>
                                    <td>{contact.country.name}</td>
                                    <td>{contact.phone}</td>
                                </tr>
                                )) : onlyEven == true ? evenData.map((contact,index) => (
                                <tr key={index}  onClick={() =>{showModalC(contact.id);  hideModalA(); hideModalB();}}>
                                    <td>{contact.id}</td>
                                    <td>{contact.country.name}</td>
                                    <td>{contact.phone}</td>
                                </tr>
                                )) :
                                    allContacts?.map((contact,index) => (
                                <tr key={index} onClick={() =>{showModalC(contact.id);  hideModalA(); hideModalB();}}>
                                    <td>{contact.id}</td>
                                    <td>{contact.country.name}</td>
                                    <td>{contact.phone}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        )}
                            </div>
                            <div className="modal-footer">
                            <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="onlyEvenCheckbox"onChange={handleCheckboxChange}
                                                                                checked={onlyEven}
                                                                        />
                                    <label className="form-check-label" htmlFor="onlyEvenCheckbox">
                                        Only even
                                    </label>
                                </div>
                                {/* <button className="btn btn-lg btn-outline-primary" type="button" onClick={showModalA}>All Contacts</button> */}
                                <button className="btn btn-md"style={{ backgroundColor: "#ff7f50", color: "#ffffff" }} onClick={() => {
                                                    hideModalA();
                                                    showModalB();
                                                }}>US Contacts</button>
                                <button type="button" className="btn btn-secondary" onClick={hideModalA}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" ref={modalRefB} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Modal B</h5>
                                <button type="button" className="btn-close" onClick={hideModalB} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                            {loadingB ? (
                                <div className="spinner-border text-info" role="status">
                                     <span className="visually-hidden">Loading...</span>
                                </div>
                        ) : (
                            <table className="table">
                            <thead>
                                <tr>
                                <th>ID</th>
                                <th>Country Name</th>
                                <th>Phone No</th>
                                </tr>
                            </thead>
                            <tbody>
                                { modalBData?.map((contact,index) => (
                                <tr key={index}  onClick={() =>{showModalC(contact.id);  hideModalA(); hideModalB();}}>
                                    <td>{contact.id}</td>
                                    <td>{contact.country.name}</td>
                                    <td>{contact.phone}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        )}
                            </div>
                            <div className="modal-footer">
                            <button className="btn btn-md"style={{ backgroundColor: "#46139f", color: "#ffffff" }} onClick={() => {
                                                    hideModalB();
                                                    showModalA();
                                                }}>All Contacts</button>
                                {/* <button className="btn btn-lg btn-outline-warning" type="button" onClick={showModalB}>US Contacts</button> */}
                                <button type="button" className="btn btn-secondary" onClick={hideModalB}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" ref={modalRefC} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Modal C</h5>
                                <button type="button" className="btn-close" onClick={hideModalC} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                            <div>
                            <p>Phone: {modalCData[0]?.phone}</p>
                        </div>
                            </div>
                            <div className="modal-footer">
                            
                                <button type="button" className="btn btn-secondary" onClick={hideModalC}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problem2;