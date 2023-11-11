import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Flex, Input, Select, Space, Table, Tag, Typography } from 'antd';
import { jwtDecode } from 'jwt-decode';
import './dashboard.css'
import get from '../api/get';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../components/CustomModal';
import ProposedDate from '../components/ProposedDate';
import post from '../api/post';
import dayjs from 'dayjs';
import patch from '../api/patch';

const { Text } = Typography

const Dashboard = () => {
  const [data, setData] = useState([])
  const [user, setUser] = useState({})
  const [postalCode, setPostalCode] = useState('')
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  const [event, setEvent] = useState({
    label: null,
    value: null,
    vendor_id: null
  })
  const [location, setLocation] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [eventOption, setEventOption] = useState([])
  const [pickedDate, setPickedDate] = useState([])
  const [modalType, setModalType] = useState('')
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false)
  const [vendorModalType, setVendorModalType] = useState('')
  const [remarks, setRemarks] = useState('')
  const [companyEventId, setCompanyEventId] = useState(null)
  const [companyEventStatus, setCompanyEventStatus] = useState(null)
  const [confirmedDate, setConfirmedDate] = useState({
    label: null,
    value: null
  })
  const [filterVendor, setFilterVendor] = useState([])
  const navigate = useNavigate()

  const columns = [
    {
      title: 'Event Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      align: 'center'
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendor',
      key: 'vendor_id',
      fixed: 'left',
      align: 'center',
      hidden: user.role === 2,
      filters: filterVendor,
      onFilter: (value, record) => record.vendor === value,
    },
    {
      title: 'Company Name',
      dataIndex: 'company',
      key: 'hr_id',
      fixed: 'left',
      align: 'center',
      hidden: user.role === 1
    },
    {
      title: 'Confirmed/Proposed Date',
      dataIndex: 'confirmed_date',
      key: 'confirmed_date',
      align: 'center',
      render: (item) => {
        if (Array.isArray(item)) {
          return <ul style={{ listStyleType: 'none' }}>
            {item.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        } else {
          return item || '-'
        }
      }
    },
    {
      title: 'Date Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center',
      render: (item) => item.split('T')[0],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      fixed: 'right',
      render: (item) => {
        switch (item) {
          case 2:
            return <Text style={{ color: '#22bb33' }}>Approved</Text>
          case 3:
            return <Text style={{ color: '#d7191c' }}>Rejected</Text>
          default:
            return <Text style={{ color: '#1677ff' }}>Pending</Text>
            break;
        }
      },
      filters: [
        {
          text: 'Pending',
          value: 1
        },
        {
          text: 'Approved',
          value: 2
        },
        {
          text: 'Rejected',
          value: 3
        }
      ],
      onFilter: (value, record) => value === record.status
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Button size="middle" onClick={() => getDetail(record)}>
          View
        </Button>
      ),
    },
  ].filter((item) => !item.hidden)

  function getDetail(data) {
    setEvent({
      label: data.name,
      value: data.name,
      vendor_id: data.vendor_id
    })

    setCompanyEventId(data.id)
    setRemarks(data.remarks || "")
    if (!Array.isArray(data.confirmed_date)) {
      setConfirmedDate({
        label: data.confirmed_date || null,
        value: data.confirmed_date || null
      })
    }
    setLocation(data.location)
    setCompanyEventStatus(data.status)
    setPickedDate(data.proposed_dates)
    showModal('view')
  }

  const decodeJwt = () => {
    return setUser(jwtDecode(localStorage.getItem('token')))
  }

  const getlist = async () => {
    setIsLoading(true)
    const user = jwtDecode(localStorage.getItem('token'))
    await get.getCompanyEvent(user.id, user.role)
      .then((res) => {
        res.forEach((value) => {
          if (!value.confirmed_date && value.status === 1) {
            value.confirmed_date = value.proposed_dates
          }
          value.key = value.id
        })
        const forFilterVendor = [... new Set(res.map(item => item.vendor))].map((value) => ({
          text: value,
          value
        }))
        setFilterVendor(forFilterVendor)
        setData(res)
      })
    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  function showModal(type) {
    if (type) {
      setModalType(type)
    } else {
      setModalType('')
    }
    setIsModalOpen(true);
  };

  function showModalVendor(type) {
    setVendorModalType(type)
    setIsVendorModalOpen(true)
  }

  function clearModalValue() {
    setEvent({
      label: null,
      value: null,
      vendor_id: null
    })
    setCompanyEventId(null)
    setConfirmedDate({
      label: null,
      value: null
    })
    setRemarks(null)
    setCompanyEventStatus(null)
    setLocation('')
    setPickedDate([])
    showModal('view')
  }

  function handleCloseVendorModal() {
    setRemarks('')
    setConfirmedDate({
      value: null,
      label: null
    })

    setIsVendorModalOpen(false)
  }

  const handleSubmitVendorModal = async () => {
    let payload = {}

    if (vendorModalType === 'reject') {
      payload.remarks = remarks
      payload.status = 3
    } else {
      payload.confirmed_date = confirmedDate.value
      payload.status = 2
    }

    await patch.updateStatus(payload, companyEventId)
      .then((res) => {
        getlist()
      })
    setIsVendorModalOpen(false)
    setIsModalOpen(false)
  }

  const handleSubmit = async () => {
    const payload = {
      name: event.label,
      vendor_id: event.vendor_id,
      hr_id: user.id,
      proposed_dates: pickedDate,
      location
    }

    await post.createEvent(payload)
      .then((res) => {
      })
      .catch((err) => console.log(err))
      .finally(() => getlist())
  }

  const handleChangeDate = (date, dateString) => {
    if (pickedDate.length < 3) {
      setPickedDate([...pickedDate, dateString])
    }
  }

  const disabledDate = (current) => {
    return current && current < dayjs().endOf('day');
  };

  const removeValue = (index) => {
    const newData = [...pickedDate]
    const removedItem = newData.splice(index, 1)
    setPickedDate(newData)
  }

  const onChangeSelect = (val, e) => {
    const {
      label,
      value,
      vendor_id,
      name
    } = e

    if (name) return setConfirmedDate(e)

    setEvent({
      label,
      value,
      vendor_id
    })
  }

  const onChange = (e) => {
    const { value, name } = e.target
    if (name === 'location') {
      setLocation(value)
    } else {
      setRemarks(value)
    }
  }

  const vendorModalBody = (
    <Flex vertical gap='middle' style={{ padding: '20px 0' }}>
      {vendorModalType === 'approve' ? (
        <Select
          fieldNames={'confirmed_date'}
          options={pickedDate.map((value, index) => (
            {
              value: value,
              label: value,
              name: 'confirmed_date'
            }
          ))}
          size='large'
          style={{ width: '100%' }}
          placeholder="Pick a Date"
          value={confirmedDate.value}
          onChange={onChangeSelect}
        />
      ) : (
        <Flex vertical gap={'small'}>
          <Text style={{ fontSize: '1rem' }}>Remarks</Text>
          <Input name='remarks' placeholder='Remarks' size='large' value={remarks} onChange={onChange} />
        </Flex>
      )}

    </Flex>
  )

  const modalBody = (
    <Flex vertical gap='middle' style={{ padding: '20px 0' }}>
      <Select
        options={eventOption}
        size='large'
        style={{ width: '100%', color: '#000' }}
        placeholder="Pick an Event"
        value={event.label}
        onChange={onChangeSelect}
        disabled={modalType}
      />
      <Flex vertical gap={'small'}>
        <Text style={{ fontSize: '1rem' }}>Proposed Dates</Text>
        <DatePicker size='large' disabledDate={disabledDate} onChange={handleChangeDate} value={''} disabled={modalType} />
        <Flex gap={'small'}>
          {pickedDate.map((val, index) => (
            <ProposedDate
              value={val}
              index={index}
              {...(!modalType && { removeValue })}
            />
          ))}
        </Flex>
      </Flex>

      <Flex vertical gap={'small'}>
        <Text style={{ fontSize: '1rem' }}>Location</Text>
        <Input style={{ color: '#000' }} name="location" placeholder='Location' disabled={modalType} size='large' value={location} onChange={onChange} />
      </Flex>
      {modalType && (
        <>
          {companyEventStatus !== 1 && (
            <Flex vertical gap={'small'}>
              <Text style={{ fontSize: '1rem' }}>Status</Text>
              <Input disabled={modalType} size='large' style={{ color: `${companyEventStatus === 2 ? '#22bb33' : '#d7191c'}` }} value={companyEventStatus === 2 ? 'Approved' : 'Rejected'} />
            </Flex>
          )}
          {companyEventStatus === 3 && (
            <Flex vertical gap={'small'}>
              <Text style={{ fontSize: '1rem' }}>Remarks</Text>
              <Input style={{ color: '#000' }} disabled={modalType} size='large' value={remarks} />
            </Flex>
          )}
          {companyEventStatus === 2 && (
            <Flex vertical gap={'small'}>
              <Text style={{ fontSize: '1rem' }}>Confirmed Date</Text>
              <Input style={{ color: '#000' }} disabled={modalType} size='large' value={confirmedDate.label} />
            </Flex>
          )}
        </>
      )}
    </Flex>
  )

  const modalFooter = (
    <>
      <Button key='back' onClick={() => showModalVendor('approve')} style={{ background: '#22bb33', color: '#fff' }}>
        Approve
      </Button>
      <Button key="submit" onClick={() => showModalVendor('reject')} style={{ background: '#d7191c', color: '#fff' }} >
        Reject
      </Button>
    </>
  )

  const vendorModalFooter = (
    <>
      <Button key='back' onClick={handleCloseVendorModal}>Cancel</Button>
      {vendorModalType === 'reject' ? (
        <Button key="submit" onClick={handleSubmitVendorModal} style={{ background: '#d7191c', color: '#fff' }} >
          Reject
        </Button>
      ) : (
        <Button key='approve' onClick={handleSubmitVendorModal} style={{ background: '#22bb33', color: '#fff' }}>
          Approve
        </Button>
      )}
    </>
  )

  const getEventOptions = async () => {
    await get.getAllEvent()
      .then((res) => {
        let temp = {}
        res.forEach((val) => {
          if (!temp[val.vendor]) {
            temp[val.vendor] = {
              ...temp[val.vendor],
              options: [{
                label: val.name,
                value: val.name,
                vendor_id: val.vendor_id,
              }]
            }
          } else {
            temp[val.vendor].options.push({
              label: val.name,
              value: val.name,
              vendor_id: val.vendor_id,
            })
          }
        })

        const forOptions = Object.keys(temp).map((key) => ({
          label: key,
          options: temp[key].options
        }))
        setEventOption(forOptions)
      })
  }

  const onChangePost = (e) => {
    const { value } = e.target
    console.log(e)
    setPostalCode(value)
  }

  const searchPostal = async () => {
    console.log(postalCode)
    await get.getLocation(postalCode)
      .then((res) => console.log(res))

  }

  useEffect(() => {
    getlist()
    decodeJwt()
    getEventOptions()
  }, [])

  return (
    <div className='dashboard-container'>

      <Space.Compact>
        <Select defaultValue="Zhejiang" />
        <Input defaultValue="Xihu District, Hangzhou" />
      </Space.Compact>
      <Button onClick={searchPostal}>Confirm</Button>
      <CustomModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title={modalType ? 'Event Detail' : 'Create new Event'}
        modalBody={modalBody}
        handleSubmit={handleSubmit}
        handleClose={clearModalValue}
        type={modalType ? 'detail' : 'create'}
        {...((user.role === 2 && companyEventStatus === 1) && { footer: modalFooter })}
      />
      <CustomModal
        isModalOpen={isVendorModalOpen}
        setIsModalOpen={setIsVendorModalOpen}
        title={vendorModalType === 'approve' ? 'Approve Event' : 'Reject Event'}
        handleClose={handleCloseVendorModal}
        handleSubmit={handleSubmitVendorModal}
        modalBody={vendorModalBody}
        footer={vendorModalFooter}
        type="confirm"
      />
      <Flex justify='space-between' align='center' style={{ marginBottom: '20px' }}>
        <h2>Welcome {user.username}</h2>
        <Button onClick={handleLogout}>Logout</Button>
      </Flex>
      {console.log(filterVendor)}
      <div className='table-container'>
        <Table
          columns={columns}
          dataSource={data}
          pagination={tableParams.pagination}
          size='medium'
          bordered={true}
          {...(user.role === 1 && {
            title: () => (
              <Button type='primary' onClick={() => showModal()}>Create new Event</Button>
            )
          })}
          loading={isLoading}
        />
      </div>
    </div>
  )
}

export default Dashboard