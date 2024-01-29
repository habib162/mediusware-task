import React, { useEffect, useState } from 'react';

const Problem1 = () => {

    const [show, setShow] = useState('all');
    const [formData, setFormData] = useState([]);

    const handleClick = (val) => {
        setShow(val);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const status = form.status.value;

        if (name !== '' && status !== '') {  
            const newData = { name, status };      
            setFormData((prevData) => [...prevData, newData]);
            localStorage.setItem('formData', JSON.stringify([...formData, newData]));
            form.reset();
        }else{
            alert('please insert data');
        }
    };
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('formData')) || [];
        setFormData(storedData);
    }, []);
    const getSortedData = (status) => {
        const order = { active: 1, completed: 2 };
        const lowercaseStatus = status.toLowerCase();
        return order[lowercaseStatus] || 3;
    };

    const sortedData = formData.filter((data) => (show === 'all' ? true : data.status.toLowerCase() === show))
        .sort((a, b) => getSortedData(a.status) - getSortedData(b.status));
    return (

        <div className="container">
            <div className="row justify-content-center mt-5">
                <h4 className='text-center text-uppercase mb-5'>Problem-1</h4>
                <div className="col-6">
                    <form className="row gy-2 gx-3 align-items-center mb-4" onSubmit={handleSubmit}>
                        <div className="col-auto">
                            <input type="text" className="form-control" name='name' placeholder="Name" />
                        </div>
                        <div className="col-auto">
                            <input type="text" className="form-control" name='status' placeholder="Status" />
                        </div>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
                <div className="col-8">
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item">
                            <button className={`nav-link ${show === 'all' && 'active'}`} type="button" onClick={() => handleClick('all')}>All</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${show === 'active' && 'active'}`} type="button" onClick={() => handleClick('active')}>Active</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${show === 'completed' && 'active'}`} type="button" onClick={() => handleClick('completed')}>Completed</button>
                        </li>
                    </ul>
                    <div className="tab-content"></div>
                    <table className="table table-striped ">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.name}</td>
                                    <td>{data.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Problem1;