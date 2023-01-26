import React, { useEffect, useState } from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Select from 'react-select';

const CustomTable = (props) => {

    const [isStatus, setStatus] = useState();
    const [filterData, setFilterData] = useState([]);

    const columns = [{
        dataField: 'createdAt',
        text: 'Data & Time',
        sort: true
    }, {
        dataField: 'crypto',
        text: 'Currency From',
        sort: true
    }, {
        dataField: 'quantity',
        text: 'Amount 1',
        sort: true
    }, {
        dataField: 'currency',
        text: 'Currency To',
        sort: true
    }, {
        dataField: 'amount',
        text: 'Amount 2',
        sort: true
    }, {
        dataField: 'status',
        text: 'Type',
        sort: true
    }];

    const defaultSorted = [{
        dataField: 'createdAt',
        order: 'desc'
    }];

    const status = [
        { value: "All", label: "All" },
        { value: "Live", label: "Live" },
        { value: "Exchanged", label: "Exchanged" }
    ]

    const onStatusChange = e => {
        setStatus(e.value);
    }

    // Is triggered for changing the type to All
    useEffect(() => {
        onStatusChange(status[0]);
    }, []);


    // Is triggered for changing the type to All
    useEffect(() => {
        if (isStatus === 'Live') {
            setFilterData(props.storedData.filter((e) => e.status === 'Live'))
        } else if (isStatus === 'Exchanged') {
            setFilterData(props.storedData.filter((e) => e.status === 'Exchanged'))
        }
    }, [props.storedData, isStatus]);

    return (
        <div className='w-100 mt-100 custom-table'>
            <span className='custom-heading w-80 text-align-left mb-20'>History</span>
            {props.storedData && props.storedData.length > 0 ?
                <>
                    <label className='flex-display w-80'>Type</label>
                    <Select
                        className='flex-display w-80 pb-10  text-align-left align-items-flex-start;'
                        value={status.filter(({ value }) => value === isStatus) || ''}
                        name="status"
                        options={status}
                        onChange={onStatusChange}
                    />

                </> : null}
            <BootstrapTable
                keyField='id'
                data={isStatus != 'All' ? filterData : props.storedData}
                columns={columns}
                pagination={paginationFactory()}
                defaultSorted={defaultSorted}
                striped
                bordered={false}
                noDataIndication="Loading..." />
        </div>
    )
}

export default CustomTable;